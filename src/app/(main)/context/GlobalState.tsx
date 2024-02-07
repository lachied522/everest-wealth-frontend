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

import type { Database, TablesUpdate } from '@/types/supabase';
import type { PortfolioData, PopulatedHolding, AdviceData } from "@/types/types";

import GlobalReducer from "./GlobalReducer";

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
  dispatch: React.Dispatch<{
    type: string,
    payload: {
      id: string,
      data?: any
      totalValue?: number
    },
  }>
  setPortfolio: (id: string, data: PopulatedHolding[]) => void
  updatePortfolioSettings: (id: string, data: TablesUpdate<'portfolios'>) => void
  setAdvice: (id: string, data: Partial<AdviceData>) => void
  toggleFavourite: (id: string) => Promise<void>
  toggleWatchlist: (symbol: string) => Promise<void>
  onPortfolioDelete: (id: string) => Promise<boolean>
}

export type Reducer = (
  prevState: PortfolioData[], 
  action: {
    type: string
    payload: any
  }
) => PortfolioData[];

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

  const setPortfolio = useCallback(async (id: string, data: PopulatedHolding[]) => {
    if (!data || !session) return;
    // remove zero unit holdings
    const filteredData = data.filter((obj) => obj.units !== 0) || [];

    const totalValue = filteredData.reduce((acc, obj) => acc + obj.value, 0);
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

  const toggleFavourite = useCallback(
    async (id: string) => {
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

  const setAdvice = useCallback(
    (id: string, data: Partial<AdviceData>) => {
      dispatch({
        type: "SET_ADVICE",
        payload: {
          id,
          data
        }
      })
  }, []);

  const updatePortfolioSettings = useCallback(
    (id: string, data: TablesUpdate<'portfolios'>) => {
      dispatch({
        type: "UPDATE_SETTINGS",
        payload: {
          id,
          data,
        }
      });
  }, [dispatch]);

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
        setPortfolio,
        toggleFavourite,
        updatePortfolioSettings,
        setAdvice,
        onPortfolioDelete,
        toggleWatchlist
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
