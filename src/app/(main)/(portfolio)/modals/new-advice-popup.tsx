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

import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useGlobalContext, GlobalState } from "@/context/GlobalState";
import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL|| "";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function NewAdvicePopup() {
    const { setAdvice } = useGlobalContext() as GlobalState;
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const router = useRouter();
    const [socketUrl, setSocketUrl] = useState<string | null>(null); // set url to null until called
    const [adviceType, setAdviceType] = useState<'deposit'|'withdraw'|'review'>('deposit'); // deposit, withdraw, or review
    const [amount, setAmount] = useState<number>(0);
    const [currentValue, setCurrentValue] = useState(0); // current value of portfolio
    const [proposedValue, setProposedValue] = useState(0); // value after proposed transaction
    const closeRef = useRef<HTMLButtonElement | null>(null);

    if (!currentPortfolio) throw new Error('currentPortfolio undefined');
    
    const { readyState, sendJsonMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        onMessage: (event) => {
            const data =  JSON.parse(event.data);
            // update advice in global state
            if ('transactions' in data) {
                console.log(data.transactions);
                setAdvice(
                    currentPortfolio.id, 
                    {
                        ...currentPortfolio.advice[0],
                        recom_transactions: data.transactions,
                    }
                );
            }
            if ('url' in data) {
                setAdvice(
                    currentPortfolio.id, 
                    {
                        ...currentPortfolio.advice[0],
                        url: data.url,
                        status: 'finished',
                    }
                );
            }
            if ('id' in data) {
                setAdvice(
                    currentPortfolio.id, 
                    {
                        ...currentPortfolio.advice[0],
                        id: data.id,
                    }
                );
                // close websocket
                setSocketUrl(null);
            }
        },
        onClose: (event) => {
            console.log('WebSocket closed:', event);
            setSocketUrl(null);
        },
        onError: (event) => {
            console.error('WebSocket error:', event);
            setSocketUrl(null);
        },
    });

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

    const onOpen = useCallback(() => {
        // establish websocket connection
        setSocketUrl(`${WEB_SOCKET_URL}/ws/${currentPortfolio.id}`);
    }, [setSocketUrl, currentPortfolio.id]);

    const onCancel = useCallback(() => {
        // reset state
        setAdviceType('deposit');
        setAmount(0);
    }, [setAdviceType, setAmount]);

    const handleMessage = useCallback((body: any) => {
        if (readyState===ReadyState.OPEN) {
            // send message
            sendJsonMessage(body);
            // reset advice data in global state
            setAdvice(
                currentPortfolio.id, 
                {
                    status: 'generating',
                    recom_transactions: [],
                }
            );
        }
    }, [currentPortfolio.id, readyState, sendJsonMessage, setAdvice]);

    const onSubmit = () => {
        handleMessage({
            reason: adviceType,
            amount: adviceType==='withdraw'? -amount: amount,
        });
        // navigate to Recommendations tab
        router.push(`/portfolio/${currentPortfolio.id}?tab=Recommendations`);
        // close modal
        if (closeRef.current) closeRef.current.click();
    } 

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    disabled={!currentPortfolio}
                    onClick={onOpen}
                >
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