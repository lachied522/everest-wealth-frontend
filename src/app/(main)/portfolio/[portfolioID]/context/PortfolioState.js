"use client";
import { createContext, useContext, useState, useEffect } from "react";

const PortfolioContext = createContext();

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children }) => {
    const [loadingNewAdvice, setLoadingNewAdvice] = useState(false);

    return (
        <PortfolioContext.Provider value={{ 
            loadingNewAdvice,
            setLoadingNewAdvice
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}