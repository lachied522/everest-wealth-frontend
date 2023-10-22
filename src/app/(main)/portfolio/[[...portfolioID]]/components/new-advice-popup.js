"use client";
import { useState, useEffect } from "react";

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

import { cn } from "@/components/lib/utils";

import { useGlobalContext } from "@/context/GlobalState";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});


export default function NewAdvicePopup({ portfolio, onSubmit }) {
    const { session } = useGlobalContext(); //raw portfolio data
    const [adviceType, setAdviceType] = useState('deposit'); //none, deposit, withdraw
    const [amount, setAmount] = useState(0);    
    const [currentValue, setCurrentValue] = useState(0)
    const [proposedValue, setProposedValue] = useState(0);

    useEffect(() => {
        if (portfolio) {
            setCurrentValue(parseFloat(portfolio.totalValue));
            setProposedValue(parseFloat(portfolio.totalValue));
            setAmount(0);
        }
    }, [portfolio]);

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

    const onAdviceSubmit = () => {
        onSubmit({
            value: proposedValue,
            reason: adviceType,
            portfolio_id: portfolio.id,
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
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
                            onClick={onAdviceSubmit}
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