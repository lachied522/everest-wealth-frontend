"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

import { useMediaQuery } from 'usehooks-ts';

const SidebarContext = createContext<any>(null);

export const useSidebarContext = () => {
    return useContext(SidebarContext);
}

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const isMobile = useMediaQuery('(max-width: 1025px)');
    const [isOpen, setIsOpen] = useState<boolean>(!isMobile);

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