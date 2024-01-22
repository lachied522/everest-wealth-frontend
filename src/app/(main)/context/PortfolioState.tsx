"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext, GlobalState } from "@/context/GlobalState";

import type { PortfolioData } from "@/types/types";

export type PortfolioState = {
    currentPortfolio: PortfolioData
    isLoadingNewAdvice: string | null
    setIsLoadingNewAdvice: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

const PortfolioContext = createContext<any>(null);

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
    const { portfolioData } = useGlobalContext() as GlobalState;
    const [isLoadingNewAdvice, setIsLoadingNewAdvice] = useState<string | null>(null);
    const params = useParams();

    // get current portfolio from params, if any
    const currentPortfolio = useMemo(() => {
        if (!portfolioData) return;

        const portfolioID = params.portfolioID;
        if (portfolioID) {
            let index = portfolioData.findIndex((obj) => obj.id === portfolioID);
            if (index > 0) {
                return portfolioData[index];
            } else {
                // default to first portfolio
                return portfolioData[0];
            }
        }

        return;
    }, [params.portfolioID, portfolioData]);

    return (
        <PortfolioContext.Provider value={{ 
            currentPortfolio,
            isLoadingNewAdvice,
            setIsLoadingNewAdvice
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}