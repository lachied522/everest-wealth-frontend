"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";

import { useGlobalContext, type GlobalState } from "@/context/GlobalState";

import type { PortfolioData, AdviceData, PopulatedHolding } from "@/types/types";

export type PortfolioState = {
    currentPortfolio?: PortfolioData
    updateHoldings: (data: PopulatedHolding[]) => void
    setAdvice: (data: AdviceData) => void
    updateSettings: (data: any) => void
    resetAdvice: () => void
    removePortfolio: () => void
}

const PortfolioContext = createContext<any>(null);

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
    const { portfolioData, dispatch } = useGlobalContext() as GlobalState;
    const params = useParams();

    // get current portfolio from params, if any
    const currentPortfolio = useMemo(() => {
        if (!portfolioData) return;

        const portfolioID = params.portfolioID;
        if (portfolioID) {
            let index = portfolioData.findIndex((obj) => obj.id === portfolioID);
            if (index > 0) {
                return portfolioData[index];
            }
            // default to first portfolio
            return portfolioData[0];
        }
    }, [params.portfolioID, portfolioData]);

    const updateHoldings = useCallback((data: PopulatedHolding[]) => {
        if (!currentPortfolio) return;
        dispatch({
            type: 'UPDATE_HOLDINGS',
            payload: {
                id: currentPortfolio.id,
                data,
            },
        })
    }, [currentPortfolio]);

    const setAdvice = useCallback((data: AdviceData) => {
        if (!currentPortfolio) return;
        dispatch({
            type: 'SET_ADVICE',
            payload: {
                id: currentPortfolio.id,
                data,
            },
        })
    }, [currentPortfolio]);

    const resetAdvice = useCallback(() => {
        if (!currentPortfolio) return;
        dispatch({
            type: 'RESET_ADVICE',
            payload: {
                id: currentPortfolio.id,
            },
        })
    }, [currentPortfolio]);

    const updateSettings = useCallback((data: any) => {
        if (!currentPortfolio) return;
        dispatch({
            type: 'SET_SETTINGS',
            payload: {
                id: currentPortfolio.id,
                data,
            },
        })
    }, [currentPortfolio]);

    const removePortfolio = useCallback(() => {
        if (!currentPortfolio) return;
        dispatch({
            type: "DELETE_PORTFOLIO",
            payload: {
              id: currentPortfolio.id,
            },
        });
    }, [currentPortfolio]);

    return (
        <PortfolioContext.Provider value={{ 
            currentPortfolio,
            setAdvice,
            resetAdvice,
            updateHoldings,
            updateSettings,
            removePortfolio,
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}