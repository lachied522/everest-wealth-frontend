"use client";
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useReducer,
  ReactNode
} from "react";
import { createClientComponentClient, Session } from "@supabase/auth-helpers-nextjs";

import type { Database } from '@/types/supabase';
import type { PortfolioData } from "@/types/types";

import { GlobalReducer, type Action } from "./GlobalReducer";

const GlobalContext = createContext<any>(null);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

type Notification = {
  href: string
  msg: string
}

export type GlobalState = {
  session: Session
  portfolioData: PortfolioData[]
  watchlist: string[]
  notifications: Notification[]
  dispatch: React.Dispatch<Action>
  createPortfolio: (data: PortfolioData) => void
  toggleFavourite: (id: string) => Promise<void>
  toggleWatchlist: (symbol: string) => Promise<void>
  onPortfolioDelete: (id: string) => Promise<boolean>
}

type Reducer = typeof GlobalReducer;

interface GlobalProviderProps {
  children: ReactNode,
  session: Session,
  portfolioJSON: string,
  userData: {
    watchlist: string[]
    notifications: string[]
  },
}

export const GlobalProvider = ({
  children,
  session,
  portfolioJSON,
  userData,
}: GlobalProviderProps) => {
  const supabase = createClientComponentClient<Database>();
  const [portfolioData, dispatch] = useReducer<Reducer>(GlobalReducer, JSON.parse(portfolioJSON));
  const [watchlist, setWatchlist] = useState<string[]>(userData.watchlist);
  const [notifications, setNotifications] = useState<string[]>(userData.notifications);

  const createPortfolio = useCallback((data: any) => {
    const newState = [
      ...portfolioData,
      { ...data, totalValue: 0, holdings: [], advice: [] },
    ];

    dispatch({ type: 'SET_DATA', payload: newState });
  }, [portfolioData, dispatch]);

  const toggleFavourite = useCallback(
    async (id: string) => {
      const { error } = await supabase.rpc("toggle_locked", {
        holding_id: id,
      });

      if (!error) {
        // update state
        dispatch({
          type: "TOGGLE_LOCKED",
          payload: {
            id,
          },
        });
      } else {
        console.log(error);
      }
  }, [supabase, dispatch]);

  const onPortfolioDelete = useCallback(async (id: string) => {
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

  const toggleWatchlist = useCallback(
    async (symbol: string) => {
      // update DB
      const { data, error } = await supabase.rpc("toggle_symbol_in_watchlist", {
        user_id: session.user.id,
        symbol,
      });

      // update state
      setWatchlist(data as string[]);
  }, [supabase, session, setWatchlist]);

  return (
    <GlobalContext.Provider
      value={{
        session,
        portfolioData,
        watchlist,
        notifications,
        dispatch,
        createPortfolio,
        toggleFavourite,
        onPortfolioDelete,
        toggleWatchlist
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
