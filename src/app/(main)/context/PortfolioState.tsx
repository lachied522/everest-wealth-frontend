"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext, GlobalState } from "@/context/GlobalState";

import type { PortfolioData } from "@/types/types";

export type PortfolioState = {
    currentPortfolio?: PortfolioData
}

const PortfolioContext = createContext<any>(null);

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const { portfolioData } = useGlobalContext() as GlobalState;
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

    return (
        <PortfolioContext.Provider value={{ 
            currentPortfolio,
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}