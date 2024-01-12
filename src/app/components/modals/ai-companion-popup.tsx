"use client";
import { useState, useRef, ReactNode, useCallback, useEffect } from "react";

import { useChat } from 'ai/react'; // https://sdk.vercel.ai/docs/guides/providers/openai

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/components/lib/utils";

import { useAICompanionContext, AICompanionState } from "@/context/AICompanionState";
import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

import type { Message } from "ai";

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

const ChatMessage = ({ m, userName } : { m: Message, userName?: string | null }) => {
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

interface ChatAreaProps {
    messages: Message[]
    isLoading: boolean
}

const ChatArea = ({ messages, isLoading }: ChatAreaProps) => {
    const bottomRef = useRef<HTMLDivElement | null>(null); // used to scroll to bottom of chat area

    return (
        <>
        {messages.length > 0 && (
            <ScrollArea className="h-full pr-3 pb-2 shadow-inner">
                {messages.map((m) => (
                    <ChatMessage key={m.id} m={m} />
                ))}
                {isLoading && messages[messages.length - 1].role!=="assistant" && <LoadingMessage />}
                <div ref={bottomRef} />
            </ScrollArea>
        )}
        </>
    )
}

export default function AICompanionPopup({ children } : {
    children: ReactNode
}) {
    const { messages, input, isLoading, handleInputChange, handleSubmit, setMessages, setInput } = useChat({
        api: "/api/chat", // this is the default value, include for specificity
    });
    const { message, samplePrompts } = useAICompanionContext() as AICompanionState;
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const onOpen = () => {
        console.log("opened")
        if (message) {
            // set input to message
            setInput(message);
        };

        // this doesn't seem to work
        if(inputRef.current) inputRef.current.focus();
    }

    const onClose = () => {
        // reset
        setMessages([]);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div onClick={onOpen}>
                    {children}
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>How Can I Help?</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="h-[60vh] flex flex-col justify-end gap-4 mb-16">
                        <ChatArea messages={messages} isLoading={isLoading} />
                        <div className="flex flex-col items-stretch gap-4">
                            {samplePrompts && (
                            <div className="grid grid-rows-2 grid-cols-2 gap-x-3 gap-y-2">
                                {samplePrompts.slice(0, 4).map((prompt, index) => (
                                    <Button
                                        key={`sample-prompt-${index}`}
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setInput(prompt)}
                                    >
                                        {prompt}
                                    </Button>
                                ))}
                            </div>
                            )}
                            <Textarea
                                ref={inputRef}
                                placeholder="Ask me something..."
                                maxLength={256}
                                value={input}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 items-center gap-6">
                        <DialogClose asChild>
                            <Button
                                ref={closeRef}
                                variant="secondary"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            Ask Me
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}