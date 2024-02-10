"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
  } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LuPiggyBank, LuRefreshCw, LuTrendingUp } from "react-icons/lu";

import { useGlobalContext, type GlobalState } from "@/context/GlobalState";
import { usePortfolioContext, type PortfolioState } from "@/context/PortfolioState";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

type AdviceResponse = {
    type: "transactions"|"url"|"id"
    payload: any
}

async function* readStream(reader: ReadableStreamDefaultReader): AsyncGenerator<AdviceResponse> {
    const decoder = new TextDecoder();

    try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          const text = decoder.decode(value);
          yield JSON.parse(text);
        }
    } catch (error) {
        console.error('Error reading stream:', error);
    }
}


export default function NewAdvicePopup() {
    const { session } = useGlobalContext() as GlobalState;
    const { currentPortfolio, setAdvice, resetAdvice } = usePortfolioContext() as PortfolioState;
    const router = useRouter();
    const [adviceType, setAdviceType] = useState<'deposit'|'withdraw'|'review'>('deposit'); // deposit, withdraw, or review
    const [amount, setAmount] = useState<number>(0);
    const [currentValue, setCurrentValue] = useState(0); // current value of portfolio
    const [proposedValue, setProposedValue] = useState(0); // value after proposed transaction
    const closeRef = useRef<HTMLButtonElement | null>(null);

    if (!currentPortfolio) throw new Error('currentPortfolio undefined');

    const updateAdviceState = useCallback(
        (key: 'recom_transactions'|'url'|'id', value: any, finished: boolean = false) => {
            // update specified key in advice state
            setAdvice({
                ...currentPortfolio.advice[0],
                status: finished? "finished": "generating",
                [key]: value
            })
        },
        [currentPortfolio.advice, setAdvice]
    );
    
    const handleRequest = useCallback(async (amount: number, reason: string) => {
        // reset advice data in global state
        resetAdvice();
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL}/new_advice/${currentPortfolio.id}`, {
            method: "POST",
            body: JSON.stringify({
                amount: reason==='withdraw'? -amount: amount,
                reason,
            }),
            headers: {
                "Content-Type": "application/json",
                token: session.access_token,
            }
        });
    
        if (!(response.ok && response.body)) return;
        
        const reader = response.body.getReader();
        
        for await (const res of readStream(reader)) {
            switch (res.type) {
                case ("transactions") : {
                    updateAdviceState("recom_transactions", res.payload);
                    break;
                }
                case ("url") : {
                    updateAdviceState("url", res.payload);
                    break;
                }
                case ("id") : {
                    updateAdviceState("id", res.payload, true);
                    break;
                }
            };
        }
    }, [currentPortfolio.id, session.access_token, updateAdviceState, resetAdvice]);

    useEffect(() => {
        setCurrentValue(currentPortfolio.totalValue);
        setProposedValue(currentPortfolio.totalValue);
        setAmount(0);
    }, [currentPortfolio.totalValue, setCurrentValue, setProposedValue, setAmount]);

    useEffect(() => {
        if (adviceType === 'deposit') {
            setProposedValue(currentValue + amount);
        } else if (adviceType === 'withdraw') {
            setProposedValue(Math.max(currentValue - amount, 0));
        } else {
            setProposedValue(currentValue);
        }
    }, [adviceType, amount, currentValue]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (parseFloat(input)) {
            setAmount(parseFloat(input));
        }
    }, [setAmount]);

    const onCancel = useCallback(() => {
        // reset state
        setAdviceType('deposit');
        setAmount(0);
    }, [setAdviceType, setAmount]);

    const onSubmit = () => {
        handleRequest(amount, adviceType);
        // navigate to Recommendations tab
        router.push(`/portfolio/${currentPortfolio.id}?tab=recommendations`);
        // close modal
        if (closeRef.current) closeRef.current.click();
    } 

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={!currentPortfolio}>
                    <LuTrendingUp className="mr-2" />
                    Get Advice
                </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Get Advice</DialogTitle>
                <DialogDescription>
                    What would you like to do?
                </DialogDescription>
            </DialogHeader>
            <form>
                <div className="flex flex-col gap-6 items-stretch justify-center py-6">
                    <div className="grid grid-cols-3 gap-4">
                        <Button
                            type="button"
                            variant={adviceType==='deposit' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('deposit')}}
                            className="p-2"
                        >
                            <LuTrendingUp size={24} className="mr-2" />
                            Invest some money
                        </Button>
                        <Button
                            type="button"
                            variant={adviceType==='review' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('review')}}
                            className="p-2"
                            disabled={currentPortfolio.totalValue===0}
                        >
                            <LuRefreshCw size={18} className="mr-2" />
                            Review portfolio
                        </Button>
                        <Button
                            type="button"
                            variant={adviceType==='withdraw' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('withdraw')}}
                            className="p-2"
                            disabled={currentPortfolio.totalValue===0}
                        >
                            <LuPiggyBank size={24} className="mr-2" />
                            Make a withdrawal
                        </Button>
                    </div>
                    <div className="h-[320px] flex flex-col justify-between px-8 mb-16">
                        {adviceType==='review' && (
                        <div className="gap-6 flex-col flex p-8">
                            <div className="grid w-full max-w-sm items-center gap-1">
                                <div className="text-base font-semibold text-slate-800">Review and rebalance portfolio</div>
                            </div>
                        </div>
                        )}
                        {adviceType!=='review' && (
                        <div className="gap-6 flex-col flex p-8">
                            <div className="grid w-full max-w-sm items-center gap-1">
                                <Label htmlFor="amount" className="text-base">Amount to {adviceType}</Label>
                                <div className="flex items-center gap-x-4 mb-6">
                                    <div className="text-300">$</div>
                                    <Input
                                        type="number"
                                        maxLength={24}
                                        name="amount"
                                        min="0"
                                        placeholder="e.g. 1000"
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                        <div className="grid grid-cols-2 place-items-center text-sm">
                            <div className="text-base text-slate-700">
                                Impied portfolio value
                            </div>
                            <div className="text-base text-slate-800">
                                {USDollar.format(proposedValue)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DialogClose asChild>
                        <Button
                            ref={closeRef}
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        onClick={onSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </form>
            </DialogContent>
        </Dialog>
    )
}