"use client";
import { useState, useEffect } from "react";
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

const WEB_SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL|| "";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});


export default function NewAdvicePopup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [socketUrl, setSocketUrl] = useState(null); // set url to null until called
    const { session, currentPortfolio, setAdvice } = useGlobalContext();
    const [adviceType, setAdviceType] = useState('deposit'); // deposit, withdraw
    const [amount, setAmount] = useState(0);    
    const [currentValue, setCurrentValue] = useState(0)
    const [proposedValue, setProposedValue] = useState(0);
    
    const { sendMessage } = useWebSocket(socketUrl, {
        onOpen: () => console.log('opened'),
        onMessage: (event) => {
            setAdvice(currentPortfolio.id, JSON.parse(event.data));
            // navigate to Recommendations tab
            if (searchParams.get("tab")!=="Recommendations") router.push(`/portfolio?p=${currentPortfolio.id}&tab=Recommendations`);
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
        if (adviceType === 'withdraw') {
            setProposedValue(Math.max(currentValue - parseFloat(amount), 0));
        } else {
            setProposedValue(currentValue + parseFloat(amount));
        }
    }, [adviceType, amount]);

    const onChange = (e) => {
        const input = e.target.value;
        setAmount(parseFloat(input));
    }

    const onCancel = () => {
        //reset state
        setAdviceType('deposit');
        setAmount(0);
    }

    const onSubmit = () => {
        // establish websocket connection
        setSocketUrl(`${WEB_SOCKET_URL}/ws/${session.user.id}`);
        sendMessage(JSON.stringify({
            amount: adviceType==='withdraw'? -amount: amount,
            reason: adviceType,
            portfolio_id: currentPortfolio.id, 
        }));
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
                <div className="flex flex-col gap-6 items-stretch justify-center">
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant={adviceType==='deposit' ? 'secondary': ''}
                            onClick={() => {setAdviceType('withdraw')}}
                        >
                            Make a withdrawal
                        </Button>
                        <Button
                            type="button"
                            variant={adviceType==='withdraw' ? 'secondary': ''}
                            onClick={() => {setAdviceType('deposit')}}
                        >
                            Invest some money
                        </Button>
                    </div>
                    <div className="overflow-hidden min-h-[240px] mb-6">
                        {adviceType!=='' && (
                        <div className="gap-6 flex-col flex p-8">
                            <div className="grid w-full max-w-sm items-center gap-1">
                                <Label htmlFor="amount">Amount to {adviceType}</Label>
                                <div className="flex items-center gap-x-4 mb-6">
                                    <div className="text-300">$</div>
                                    <Input
                                        type="number"
                                        maxLength="256"
                                        name="amount"
                                        min="0"
                                        placeholder="e.g. 1000"
                                        value={amount}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 place-items-center text-sm">
                                <div className="text-slate-700">
                                    Impied portfolio value
                                </div>
                                <div className="text-slate-800">
                                    {USDollar.format(proposedValue)}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            onClick={onSubmit}
                        >
                            Submit
                        </Button>
                    </DialogClose>
                </div>
            </form>
            </DialogContent>
        </Dialog>
    )
}