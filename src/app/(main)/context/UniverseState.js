"use client";
import { createContext, useContext } from "react";

const UniverseContext = createContext();

export const useUniverseContext = () => {
    return useContext(UniverseContext);
}

export const UniverseProvider = ({ children, universeDataMap }) => {  
    return (
        <UniverseContext.Provider value={{ universeDataMap }}>
            {children}
        </UniverseContext.Provider>
    )
}