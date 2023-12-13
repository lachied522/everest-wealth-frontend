"use client";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalState";


const PortfolioContext = createContext();

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children }) => {
    const { portfolioData } = useGlobalContext();
    const [loadingNewAdvice, setLoadingNewAdvice] = useState(false);
    const params = useParams();

    // get current portfolio from params
    const currentPortfolio = useMemo(() => {
        if (!portfolioData) return;

        const portfolioID = params["portfolioID"];
        if (portfolioID && portfolioData) {
            let index = portfolioData.findIndex((obj) => obj.id === portfolioID);
            if (index > 0) {
                return portfolioData[index];
            } else {
                // default to first portfolio
                return portfolioData[0];
            }
        }

        return;
    }, [params, portfolioData]);

    return (
        <PortfolioContext.Provider value={{ 
            currentPortfolio,
            loadingNewAdvice,
            setLoadingNewAdvice
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}