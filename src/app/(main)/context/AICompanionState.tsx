"use client";
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

import { usePathname } from "next/navigation";
import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

const AICompanionContext = createContext<any>(null);

export const useAICompanionContext = () => {
    return useContext(AICompanionContext);
}

const SAMPLE_PROMPTS_ARRAY = [
    "Should I buy shares in BHP?",
    "Should I invest more in ETFs?",
    "Why is the market up or down?",
    "What does 'EPS' mean?"
]

export type AICompanionState = {
    isSilent: boolean
    message: string | null
    samplePrompts: string[] | null
    portfolioID?: string
    toggleIsSilent: () => void
    setMessage: React.Dispatch<React.SetStateAction<string | null | undefined>>
    setSamplePrompts: React.Dispatch<React.SetStateAction<string[] | null | undefined>>
    setPortfolioID: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

export const AICompanionProvider = ({ children }: { children: React.ReactNode }) => {
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const pathname = usePathname();
    const [isSilent, setIsSilent] = useState<boolean>(false);
    const [message, setMessage] = useState<string | null>();
    const [samplePrompts, setSamplePrompts] = useState<string[] | null>(SAMPLE_PROMPTS_ARRAY);
    const [portfolioID, setPortfolioID] = useState<string | undefined>(); // id of portfolio that conversation relates to
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!timerRef.current) {
            if (pathname.startsWith('/symbol')) {
                const symbol = pathname.split('/').at(-1);
                newMessage(`Should I invest in ${symbol}?`);
            }
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        }

        async function newMessage(m: string) {
            setMessage(m);
            // remove message after three seconds
            timerRef.current = setTimeout(() => {
                setMessage(null);
            }, 3000);
        }
    }, [pathname, setMessage]);

    useEffect(() => {
        if (currentPortfolio) setPortfolioID(currentPortfolio.id);
    }, [currentPortfolio]);

    const toggleIsSilent = useCallback(() => {
        setIsSilent((prevState) => {
            if (!prevState) setMessage(null); // remove message
            return !prevState
        });
    }, [setIsSilent]);

    return (
        <AICompanionContext.Provider value={{
            isSilent,
            message,
            samplePrompts,
            portfolioID,
            toggleIsSilent,
            setMessage,
            setSamplePrompts,
            setPortfolioID
        }}>
            {children}
        </AICompanionContext.Provider>
    )
}