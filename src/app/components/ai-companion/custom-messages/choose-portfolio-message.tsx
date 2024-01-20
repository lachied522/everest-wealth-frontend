"use client";
import { useCallback, useEffect, useMemo } from "react";

import { Button } from "@/components/ui/button";

import { LuCheck } from "react-icons/lu";

import { useGlobalContext, GlobalState } from "@/context/GlobalState";
import { useAICompanionContext, AICompanionState } from "../AICompanionState";
import { cn } from "@/components/lib/utils";

interface ChoosePortfolioMessageProps {
    index: number
    content: string
}

// custom chat message that appears when user must select portfolio
export default function ChoosePortfolioMessage({ index, content } : ChoosePortfolioMessageProps) {
    const { portfolioData } = useGlobalContext() as GlobalState;
    const { messages, setMessages, setPortfolioID, setIsDisabled, handleRequest } = useAICompanionContext() as AICompanionState;

    const onClick = useCallback((input: string) => {
        // update message state
        const newMessages = messages.map(
            (m, i) => (index===i ? {
                ...m,
                content: `!choosePortfolio:${input}`,
            }: m)
        );
        setMessages(newMessages);
        // update portfolioID state
        setPortfolioID(input);
        // initiate new request with updated portfolioID
        handleRequest(newMessages, input);
        setIsDisabled(false);
    }, [messages, setPortfolioID, setIsDisabled, handleRequest]);

    const selectedPortfolioID = useMemo(() => {
        const match = content.match(/^!choosePortfolio:(.+)$/);
        if (match) {
            if (match[1]) return match[1];
        }
        return null;
    }, [content]);

    return (
        <>
            <div className="flex flex-col gap-1 items-start mt-2">
                <div className="text-sm text-slate-800">AI</div>
                <div className="text-slate-800 text-sm rounded-lg border border-slate-300 p-3 gap-3 whitespace-pre-wrap">
                    Choose a portfolio
                </div>
            </div>
            <div className="flex flex-col gap-1 items-end mt-2">
                <div className="text-sm text-slate-800">Me</div>
                <div className="max-w-[90%] flex flex-wrap text-slate-800 text-sm rounded-lg border border-slate-300 p-3 gap-3">
                    {portfolioData.map((portfolio, index) => (
                    <Button
                        key={`choose-portfolio-${index}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => onClick(portfolio.id)}
                        disabled={!!selectedPortfolioID && selectedPortfolioID!==portfolio.id}
                    >
                        {portfolio.name}
                    </Button>
                    ))}
                </div>
            </div>
        </>
    )
}
