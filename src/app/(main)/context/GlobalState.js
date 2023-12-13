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

import GlobalReducer from "./GlobalReducer";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({
  children,
  session,
  portfolioJSON,
  watchlistData,
}) => {
  const supabase = createClientComponentClient();
  const [state, dispatch] = useReducer(GlobalReducer, JSON.parse(portfolioJSON));
  const [watchlist, setWatchlist] = useState(watchlistData || []);

  const updatePortfolio = useCallback(async (id, data) => {
    if (!session || !data) return;
    // remove zero unit holdings
    const filteredData = data.filter((obj) => obj.units !== 0) || [];

    const totalValue = filteredData.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
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

    // update state
    setWatchlist(data);
  }, [supabase, session, setWatchlist]);

  return (
    <GlobalContext.Provider
      value={{
        session,
        portfolioData: state,
        updatePortfolio,
        toggleFavourite,
        updatePortfolioSettings,
        setAdvice,
        toggleAdviceActioned,
        onPortfolioDelete,
        watchlist,
        toggleWatchlist
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
