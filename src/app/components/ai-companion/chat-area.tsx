"use client";
import { useState, useRef, useEffect } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/components/lib/utils";

import { useAICompanionContext, AICompanionState } from "@/components/ai-companion/AICompanionState";

import type { Message } from "@/types/ai";
import ChoosePortfolioMessage from "./custom-messages/choose-portfolio-message";

const LoadingMessage = () => {
    // return message to display when loading
    const [text, setText] = useState<string>('. ');

    useEffect(() => {
        const c = '. ';

        const interval = setInterval(() => {
            setText((s) => {
                if (s==='. . . ') return '. '

                return s + c
            })
        }, 350);

        return () => {
            clearInterval(interval)
        }
    }, []);

    return (
        <div className="flex flex-col gap-1 items-start mt-2">
            <div className="text-sm text-slate-800">AI</div>
            <div className="text-slate-800 text-sm rounded-lg border border-slate-300 p-3 whitespace-pre-wrap">
                {text}
            </div>
        </div>
    )
}

const ChatMessage = ({ m } : { m: Message, userName?: string | null }) => {
    return (
        <>
        {m.content.length > 0 ? (
            <div className={cn(
                "flex flex-col gap-1 items-start mt-2",
                m.role==="user" && "items-end"
            )}>
                <div className="text-sm text-slate-800">{m.role==="user" ? "Me": "AI"}</div>
                <div className={cn(
                    "text-slate-800 text-sm rounded-lg border border-slate-300 p-3 whitespace-pre-wrap",
                    m.role==="user" && "text-slate-700"
                )}>
                    {m.content}
                </div>
            </div>
        ) : null}
        </>
    )
}

export default function ChatArea() {
    const { messages, isLoading } = useAICompanionContext() as AICompanionState;
    const bottomRef = useRef<HTMLDivElement | null>(null); // used to scroll to bottom of chat area

    return (
        <>
            {messages.length > 0 && (
            <ScrollArea className="h-full pl-2 pr-3 pb-4 shadow-inner">
                {messages.map((m, i) => (
                <div key={`chat-message-${i}`}>
                    {m.content.startsWith("!choosePortfolio") ? (
                    <ChoosePortfolioMessage index={i} content={m.content} />
                    ) : (
                    <ChatMessage m={m} />
                    )}
                </div>
                ))}
                {isLoading && messages[messages.length - 1].role!=="assistant" && <LoadingMessage />}
                <div ref={bottomRef} />
            </ScrollArea>
            )}
        </>
    )
}
