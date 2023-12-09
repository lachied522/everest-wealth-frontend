"use client";
import {
  createContext,
  useState,
  useMemo,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useParams } from "next/navigation";

import GlobalReducer from "./GlobalReducer";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({
  children,
  session,
  portfolioData,
  watchlistData,
}) => {
  const supabase = createClientComponentClient();
  const params = useParams();
  const [state, dispatch] = useReducer(GlobalReducer, portfolioData);
  const [watchlist, setWatchlist] = useState(watchlistData || []);

  // get current portfolio from params
  const currentPortfolio = useMemo(() => {
    if (!state) return;

    const portfolioID = params["portfolioID"];
    if (portfolioID && state) {
      let index = state.findIndex((obj) => obj.id === portfolioID);
      if (index > 0) {
        return state[index];
      } else {
        // default to first portfolio
        return state[0];
      }
    }

    return;
  }, [params, state]);

  const commitPortfolio = useCallback(async (id, data) => {
    // upsert modified holdings to DB
    // should this be handled server side?
    const newHoldings = [];
    // get current portfolio
    const portfolio = state.find((obj) => obj.id === id);

    if (!portfolio) return false;

    const symbols = Array.from(portfolio.holdings, (obj) => {
      return obj.symbol;
    });
    for (const holding of data) {
      const index = symbols.indexOf(holding.symbol);
      if (index > -1) {
        // existing holding
        if (holding.units === portfolio.holdings[index].units) continue; // skip if holding has not been modified
        newHoldings.push({
          id: holding.id,
          symbol: holding.symbol,
          units: Math.max(holding.units, 0), // zero unit holdings are removed automatically by DB
          cost: holding.cost,
          portfolio_id: id,
        });
      } else {
        // new holding
        newHoldings.push({
          symbol: holding.symbol,
          units: Math.max(holding.units, 0),
          cost: holding.cost,
          portfolio_id: id,
        });
      }
    }

    if (newHoldings.length > 0) {
      const { error } = await supabase
        .from("holdings")
        .upsert(newHoldings, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
        .select();

      if (error) {
        return false;
      }
    }

    return true;
  }, [supabase, state]);

  const updatePortfolio = useCallback(async (id, data) => {
    if (!session || !data) return;
    // remove zero unit holdings
    const filteredData = data.filter((obj) => obj.units !== 0) || [];

    // calculate total portfolio values
    let totalValue = 0;

    await Promise.all(filteredData.map(async (holding) => {
      // remove zero unit holdings
      if (holding.units === 0) return;
      const params = new URLSearchParams({ s: holding.symbol });
      const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
      
      totalValue += data['last_price'] * holding.units || 0;
    }));

    // update state
    dispatch({
      type: "UPDATE_DATA",
      payload: {
        id,
        data: filteredData,
        totalValue,
      },
    });
  }, [session, dispatch]);

  const toggleFavourite = useCallback(async (id) => {
    // update DB
    if (!session) return;

    const { error } = await supabase.rpc("toggle_locked", {
      holding_id: id,
    });

    if (!error) {
      // update state
      dispatch({
        type: "TOGGLE_FAVOURITE",
        payload: {
          id,
        },
      });
    } else {
      console.log(error);
    }
  }, [supabase, session, dispatch]);

  const setAdvice = useCallback((id, data) => {
    dispatch({
      type: "SET_ADVICE",
      payload: {
        id,
        data
      }
    })
  }, []);

  const toggleAdviceActioned = useCallback((id) => {
    // toggle 'actioned' state of advice for portfolio
    dispatch({
      type: "TOGGLE_ACTIONED",
      payload: {
        id,
      },
    });
  }, [dispatch]);

  const updatePortfolioSettings = useCallback(async (id, data) => {
    const { error } = await supabase
      .from("portfolios")
      .update(data)
      .eq("id", id)
      .select();

    if (!error) {
        dispatch({
            type: "UPDATE_SETTINGS",
            payload: {
              id,
              data,
            },
          });
    } else {
        console.log(error);
        return false;
    };

    return true;
  }, [supabase, dispatch]);

  const onPortfolioDelete = useCallback(async (id) => {
    // delete record from DB
    const { error } = await supabase.from("portfolios").delete().eq("id", id);

    if (!error) {
      // update state
      dispatch({
        type: "DELETE_PORTFOLIO",
        payload: {
          id,
        },
      });
    } else {
      console.log(error);
      return false;
    }

    return true;
  }, [supabase, dispatch]);

  const toggleWatchlist = useCallback(async (symbol) => {
    // update DB
    const { data, error } = await supabase.rpc("toggle_symbol_in_watchlist", {
      user_id: session.user.id,
      symbol,
    });

    if (!error) {
      // update state
      setWatchlist(data);
    } else {
      console.log(error);
    } 
  }, [supabase, session, setWatchlist]);

  return (
    <GlobalContext.Provider
      value={{
        session,
        portfolioData: state,
        currentPortfolio,
        updatePortfolio,
        toggleFavourite,
        updatePortfolioSettings,
        setAdvice,
        toggleAdviceActioned,
        commitPortfolio,
        onPortfolioDelete,
        watchlist,
        toggleWatchlist
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
