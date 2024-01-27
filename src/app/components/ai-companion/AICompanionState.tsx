"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

import type { Message } from "@/types/ai";

const AICompanionContext = createContext<any>(null);

export const useAICompanionContext = () => {
    return useContext(AICompanionContext);
}

const SAMPLE_PROMPTS_ARRAY = [
    "Should I buy shares in BHP?",
    "Should I invest more in ETFs?",
    "Why is the market up/down today?",
    "What does 'EPS' mean?"
]

async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
    const decoder = new TextDecoder();

    try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const text = decoder.decode(value);
          yield text;
        }
    } catch (error) {
    console.error('Error reading stream:', error);
    }
};

export type AICompanionState = {
    toast: string | null
    toastVisible: boolean
    samplePrompts: string[] | null
    messages: Message[]
    isLoading: boolean
    isDisabled: boolean
    portfolioID?: string
    setMessages: React.Dispatch<React.SetStateAction<Message[] | null | undefined>>
    handleRequest: (messages: Message[], portfolioID?: string) => Promise<void>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean | null | undefined>>
    setIsDisabled: React.Dispatch<React.SetStateAction<boolean | null | undefined>>
    setSamplePrompts: React.Dispatch<React.SetStateAction<string[] | null | undefined>>
    setPortfolioID: React.Dispatch<React.SetStateAction<string | null | undefined>>
}

export const AICompanionProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const [toast, setToast] = useState<string | null>();
    const [toastVisible, setToastVisible] = useState<boolean>(true);
    const [toastHistory, setToastHistory] = useState<string[]>([]); // array of toast messages that have already been displayed to user
    const [samplePrompts, setSamplePrompts] = useState<string[] | null>(SAMPLE_PROMPTS_ARRAY);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false); // loading new message
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [portfolioID, setPortfolioID] = useState<string | undefined>(); // id of portfolio that conversation relates to

    const { currentPortfolio } = usePortfolioContext() as PortfolioState;

    const newToast = useCallback((m: string) => {
        if (toastHistory.includes(m)) return; // prevent showing same message to user more than once 
        setToast(m);
        // remove message after three seconds
        setTimeout(() => {
            setToast(null);
        }, 10000);
        // update toast history
        setToastHistory((prevArray) => [...prevArray, m]);
    }, [toastHistory, setToast, setToastHistory]);

    useEffect(() => {
        if (pathname.startsWith('/dashboard')) {
            newToast('What happened in the market today?');
        } else if (pathname.startsWith('/symbol')) {
            const symbol = pathname.split('/').at(-1);
            newToast(`Should I invest in ${symbol}?`);
        }
    }, [pathname, newToast]);

    useEffect(() => {
        if (currentPortfolio) setPortfolioID(currentPortfolio.id);
    }, [currentPortfolio, setPortfolioID]);

    const choosePortfolio = useCallback((messages: Message[]) => {
        // triggered when chat API tries to call function that requires a portfolioID,
        // prompt user to choose portfolio by adding a custom message
        setIsDisabled(true);
        setMessages([
            ...messages,
            {
                content: "!choosePortfolio",
                role: "custom",
            }
        ]);
    }, [setMessages, setIsDisabled]);

    const handleRequest = useCallback(async (messages: Message[], referencePortfolioID?: string) => {
        try {
            setIsLoading(true);
            // filter out custom messages
            const filteredMessages = messages.filter((message) => message.role !== "custom");

            const response = await fetch('/api/chat', {
                method: "POST",
                body: JSON.stringify({
                    messages: filteredMessages,
                    portfolioID: referencePortfolioID ?? portfolioID,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!(response.ok && response.body)) return;
        
            const reader = response.body.getReader();
            let finishedMessage: Message = {
                content: "",
                role: "assistant"
            };
            for await (const text of readStream(reader)) {
                // check for errors matching !error:ErrorName
                const error = text.match(/^!error:(\w+)$/);
                if (error) {
                    switch (error[1]) {
                        case ("PortfolioIDUndefinedError"): {
                            choosePortfolio(messages);
                            break;
                        };
                    };
                    break;
                }

                finishedMessage.content += text;
                setMessages([
                    ...messages,
                    finishedMessage
                ]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }, [portfolioID, setMessages, setIsLoading, choosePortfolio]);

    return (
        <AICompanionContext.Provider value={{
            toast,
            toastVisible,
            samplePrompts,
            messages,
            isLoading,
            isDisabled,
            portfolioID,
            setMessages,
            handleRequest,
            setIsLoading,
            setIsDisabled,
            setSamplePrompts,
            setPortfolioID
        }}>
            {children}
        </AICompanionContext.Provider>
    )
}