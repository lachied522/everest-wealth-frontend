"use client";
import { useState, useRef, ReactNode, useCallback, useEffect } from "react";

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

import { LuCheck } from "react-icons/lu";

import { useGlobalContext, GlobalState } from "@/context/GlobalState";
import { useAICompanionContext, AICompanionState } from "@/context/AICompanionState";

interface Message {
    content: string;
    role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool';
}

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

const ChoosePortfolioMessage = ({ selected } : { selected?: string }) => {
    const { portfolioData } = useGlobalContext() as GlobalState;
    const { portfolioID, setPortfolioID } = useAICompanionContext() as AICompanionState;

    return (
        <>
            <div className="flex flex-col gap-1 items-start mt-2">
                <div className="text-sm text-slate-800">AI</div>
                <div className="text-slate-800 text-sm rounded-lg border border-slate-300 p-3 gap-3 whitespace-pre-wrap">
                    Choose portfolio
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
                        onClick={() => setPortfolioID(portfolio.id)}
                        disabled={!(portfolioID===portfolio.id)}
                    >
                        {portfolioID===portfolio.id && <LuCheck className="text-green-300/80 mr-2"/>}
                        {portfolio.name}
                    </Button>
                    ))}
                </div>
            </div>
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
            <ScrollArea className="h-full pl-2 pr-3 pb-4 shadow-inner">
                {messages.map((m, i) => (
                    <>
                    {m.content==="!choosePortfolio" ? (
                        <ChoosePortfolioMessage />
                    ) : (
                        <ChatMessage key={`chat-message-${i}`} m={m} />
                    )}
                    </>
                ))}
                {isLoading && messages[messages.length - 1].role!=="assistant" && <LoadingMessage />}
                <div ref={bottomRef} />
            </ScrollArea>
            )}
        </>
    )
}

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

export default function AICompanionPopup({ children } : {
    children: ReactNode
}) {
    const { message, samplePrompts, portfolioID } = useAICompanionContext() as AICompanionState;
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const onOpen = () => {
        if (message) {
            // set input to message
            setInput(message);
        };

        // this doesn't seem to work
        if(inputRef.current) inputRef.current.focus();
    }

    const onClose = useCallback(() => {
        // reset
        setMessages([]);
        // reset input
        setInput("");
    }, [setMessages, setInput]);

    const handleRequest = useCallback(async (messages: Message[], portfolioID?: string) => {
        const response = await fetch('/api/chat', {
            method: "POST",
            body: JSON.stringify({
                messages,
                portfolioID,
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
            finishedMessage.content += text;
            setMessages([
                ...messages,
                finishedMessage
            ]);
        }
    }, [setMessages]);

    const onMessageSubmit = useCallback(async (content: string) => {
        // add user message to messages
        const newMessages: Message[] = [...messages, {
            role: "user",
            content,
        }]
        setMessages(newMessages);
        // reset input
        setInput("");
        // set loading to true
        setIsLoading(true);
        // handle request then set loading to false
        handleRequest(newMessages, portfolioID).finally(() => setIsLoading(false));
    }, [messages, setMessages, setInput, setIsLoading]);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input) return;

        onMessageSubmit(input);
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
                <form onSubmit={onSubmit}>
                    <div className="h-[60vh] flex flex-col justify-end gap-4 mb-16">
                        <ChatArea
                            messages={messages}
                            isLoading={isLoading}
                        />
                        <div className="flex flex-col items-stretch gap-4">
                            {samplePrompts && (
                            <div className="grid grid-rows-2 grid-cols-2 gap-x-3 gap-y-2">
                                {samplePrompts.slice(0, 4).map((prompt, index) => (
                                <Button
                                    key={`sample-prompt-${index}`}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onMessageSubmit(prompt)}
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
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                                className="text-slate-700"
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
                                Exit
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