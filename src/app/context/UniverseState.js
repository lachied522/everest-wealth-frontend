"use client";
import { createContext, useContext, useState } from "react";

const UniverseContext = createContext();

export const useUniverseContext = () => {
    return useContext(UniverseContext);
}

export const UniverseProvider = ({ children, universeData }) => {  
    return (
        <UniverseContext.Provider value={{ universeData }}>
            {children}
        </UniverseContext.Provider>
    )
}