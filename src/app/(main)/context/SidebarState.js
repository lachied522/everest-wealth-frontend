"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { useMediaQuery } from 'usehooks-ts';


const SidebarContext = createContext();

export const useSidebarContext = () => {
    return useContext(SidebarContext);
}

export const SidebarProvider = ({ children }) => {
    const isMobile = useMediaQuery('(max-width: 856px)');
    const [isOpen, setIsOpen] = useState(!isMobile);

    useEffect(() => {
        setIsOpen(!isMobile);
      }, [isMobile]);
    
    return (
        <SidebarContext.Provider value={{ 
            sidebarOpen: isOpen, 
            setSidebarOpen: setIsOpen,
            isMobile
        }}>
            {children}
        </SidebarContext.Provider>
    )
}