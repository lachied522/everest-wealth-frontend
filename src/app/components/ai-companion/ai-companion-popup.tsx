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

import { useAICompanionContext, AICompanionState } from "./AICompanionState";
import ChatArea from "./chat-area";

import type { Message } from "@/types/ai";

export default function AICompanionPopup({ children } : {
    children: ReactNode
}) {
    const {
        messages,
        isLoading,
        isDisabled,
        toast,
        samplePrompts,
        setMessages,
        setIsDisabled,
        handleRequest,
    } = useAICompanionContext() as AICompanionState;
    const [input, setInput] = useState<string>("");
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const onOpen = useCallback(() => {
        if (toast) {
            // set input to message
            setInput(toast);
        };

        // this doesn't seem to work
        if(inputRef.current) inputRef.current.focus();
    }, [toast, inputRef, setInput]);

    const onClose = useCallback(() => {
        // reset
        setMessages([]);
        // reset input
        setInput("");
        // make sure isDisabled is false
        setIsDisabled(false);
    }, [setMessages, setInput, setIsDisabled]);

    const onMessageSubmit = useCallback(async (content: string) => {
        if (isLoading || isDisabled) return;
        // add user message to messages
        const newMessages: Message[] = [...messages, {
            role: "user",
            content,
        }];
        setMessages(newMessages);
        // reset input
        setInput("");
        // handle request then set loading to false
        handleRequest(newMessages);
    }, [isLoading, isDisabled, messages, setMessages, setInput, handleRequest]);

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
                        <ChatArea />
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