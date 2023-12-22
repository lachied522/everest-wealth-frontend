"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

import { LuTrendingUp } from "react-icons/lu";

import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useGlobalContext } from "@/context/GlobalState";
import { usePortfolioContext } from "../context/PortfolioState";

const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL|| "";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

export default function NewAdvicePopup() {
    const { session, setAdvice } = useGlobalContext();
    const { currentPortfolio, setLoadingNewAdvice } = usePortfolioContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [socketUrl, setSocketUrl] = useState<string | null>(null); // set url to null until called
    const [adviceType, setAdviceType] = useState<string>('review'); // deposit, withdraw, or review
    const [amount, setAmount] = useState<number>(0);    
    const [currentValue, setCurrentValue] = useState(0) // current value of portfolio
    const [proposedValue, setProposedValue] = useState(0);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    
    const { sendMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        onMessage: (event) => {
            console.log(event.data);
            // remove loading state
            setLoadingNewAdvice(false);
            // update advice in global state
            setAdvice(currentPortfolio.id, JSON.parse(event.data));
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
        if (currentPortfolio) {
            setCurrentValue(parseFloat(currentPortfolio.totalValue));
            setProposedValue(parseFloat(currentPortfolio.totalValue));
            setAmount(0);
        }
    }, [currentPortfolio]);

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

    const onCancel = () => {
        // reset state
        setAdviceType('review');
        setAmount(0);
        // close websocket
        setSocketUrl(null);
    }

    const onSubmit = () => {
        setLoadingNewAdvice(true);
        // establish websocket connection
        setSocketUrl(`${WEB_SOCKET_URL}/ws/${session.user.id}`);
        sendMessage(JSON.stringify({
            portfolio_id: currentPortfolio.id, 
            reason: adviceType,
            amount: adviceType==='withdraw'? -amount: amount,
        }));
        // close modal
        if (closeRef.current) closeRef.current.click();
        // navigate to Recommendations tab
        if (searchParams.get("tab")!=="Recommendations") router.push(`/portfolio/${currentPortfolio.id}?tab=Recommendations`);
    } 

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    disabled={!currentPortfolio}
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
                            variant={adviceType==='review' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('review')}}
                        >
                            Review portfolio
                        </Button>
                        <Button
                            type="button"
                            variant={adviceType==='withdraw' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('withdraw')}}
                        >
                            Make a withdrawal
                        </Button>
                        <Button
                            type="button"
                            variant={adviceType==='deposit' ? 'default': 'secondary'}
                            onClick={() => {setAdviceType('deposit')}}
                        >
                            Invest some money
                        </Button>
                    </div>
                    <div className="h-[240px] flex flex-col justify-between px-8 mb-16">
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
                                        value={amount}
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