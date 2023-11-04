"use client";
import {
  createContext,
  useMemo,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";

import GlobalReducer from "./GlobalReducer";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({
  children,
  session,
  userData,
  universeDataMap,
}) => {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const [state, dispatch] = useReducer(GlobalReducer, userData);

  // get current portfolio from params
  const currentPortfolio = useMemo(() => {
    if (!state) return;

    const portfolioID = searchParams.get("p");

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
  }, [searchParams, state]);

  const commitPortfolio = async (id, data) => {
    // upsert modified holdings to DB
    // should this be handled server side?
    const newHoldings = [];
    // get current portfolio
    const portfolio = userData.find((obj) => obj.id === id);

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
        .upsert(newHoldings)
        .select();

      if (error) {
        return false;
      }
    }

    return true;
  };

  const updatePortfolio = (id, data) => {
    // remove zero unit holdings
    const filteredData = data?.filter((obj) => obj.units !== 0) || [];

    // calculate total portfolio values
    let totalValue = 0;

    filteredData.forEach((holding) => {
      if (universeDataMap.has(holding.symbol)) {
        const price = universeDataMap.get(holding.symbol).last_price;
        totalValue += price * holding.units;
      }
    });

    // update state
    dispatch({
      type: "UPDATE_DATA",
      payload: {
        id,
        filteredData,
        totalValue,
      },
    });
  };

  const toggleFavourite = async (id) => {
    dispatch({
      type: "TOGGLE_FAVOURITE",
      payload: {
        id,
      },
    });

    // update DB
    if (!session) return;
    const { data, error } = await supabase.rpc("toggle_locked", {
      holding_id: id,
    });

    if (error) console.log(`Error committing changes: ${error}`);
  };

  const addNewAdvice = (id, adviceData) => {
    console.log(adviceData);
  };

  const toggleAdviceActioned = (id) => {
    // toggle 'actioned' state of advice for portfolio
    dispatch({
      type: "TOGGLE_ACTIONED",
      payload: {
        id,
      },
    });
  };

  const updatePortfolioSettings = async (id, data) => {
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
        console.log(`Error committing changes: ${error}`)
        return false;
    };

    return true;
  };

  const onPortfolioDelete = async (id) => {
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
  };

  return (
    <GlobalContext.Provider
      value={{
        session,
        portfolioData: state,
        currentPortfolio,
        updatePortfolio,
        toggleFavourite,
        updatePortfolioSettings,
        addNewAdvice,
        toggleAdviceActioned,
        commitPortfolio,
        onPortfolioDelete,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
