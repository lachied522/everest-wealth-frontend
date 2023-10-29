"use client";
import { useState, useEffect, useRef } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { LuSettings, LuTrash, LuCheck, LuCircle, LuLoader2 } from "react-icons/lu";
import { cn } from "@/components/lib/utils";

import { useGlobalContext } from "@/context/GlobalState";

export default function PortfolioSettingsPopup({ portfolio }) {
    const { updatePortfolioName, deletePortfolio } = useGlobalContext();
    const [brokerageType, setBrokerageType] = useState();
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const closeRef = useRef(null);
    const [formData, setFormData] = useState({
        name: portfolio.name,
        objective: portfolio.objective,
        brokerage: {
            percent: 0,
            dollar: 0,
        },
    });


    useEffect(() => {
        // set form data on portfolio change
        if (portfolio) {
            // brokerage is either percentage or flat based, use regex to determine
            const percentagePattern = /^\d+(\.\d+)?%$/;
            const dollarPattern = /^\$\d+(\.\d+)?$/;

            let brokerage = {
                percent: 0,
                dollar: 0
            };
    
            if (percentagePattern.test(portfolio.brokerage)) {
                brokerage['percent'] = parseFloat(portfolio.brokerage);
            } else if (dollarPattern.test(portfolio.brokerage)) {
                brokerage['dollar'] = parseFloat(portfolio.brokerage.replace('$', ''));
            }

            setFormData({
                name: portfolio.name,
                objective: portfolio.objective,
                brokerage,
            });
        }
    }, [portfolio]);

    const toggleBrokerageType = () => {
        if (brokerageType==='%') {
            setBrokerageType('$');
        } else {
            setBrokerageType('%');
        }
    }

    const handleChange = ({ name, value } ) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const onDataChange = (e) => {
        handleChange(e.target);
    }

    const onDelete = async () => {
        // delete portfolio
        setLoading(true);
        const success = await deletePortfolio(portfolio.id);
        // close dialog
        if (success && closeRef.current) closeRef.current.click();
    }

    const cancel = () => {
        // wait for dialog to close, then reset form
        setTimeout(() => {
            setFormData({
                name: portfolio.name,
                objective: portfolio.objective,
                brokerage: portfolio.brokerage,
            });
            setBrokerageType();
            setConfirmDelete(false);
            setLoading(false);
        }, 1000);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-slate-800">
                    <LuSettings 
                        size={24}
                        className="text-slate-700"
                    />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Portfolio Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-16 py-8">
                    <form className="flex flex-col items-center justify-items-center gap-16 md:px-3">
                        <div className="flex items-center gap-8">
                            <div className="text-lg text-slate-800">Portfolio Name</div>
                            <Input
                                type="text"
                                maxLength={20}
                                name="name"
                                data-name="Name"
                                placeholder="My Portfolio"
                                value={formData.name}
                                onChange={onDataChange}
                                className="text-lg w-[200px] bg-transparent text-slate-800"
                            />
                        </div>
                        <div className="flex flex-col place-items-center gap-8">
                            <div className="text-lg text-center text-slate-800">Brokerage</div>
                            <div className="flex gap-8">
                                <Button
                                    type="button"
                                    variant='ghost'
                                    onClick={toggleBrokerageType}
                                >
                                    <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                        <LuCircle className={cn(
                                            "h-2.5 w-2.5 hidden",
                                            brokerageType==='$' && "block fill-slate-700"
                                        )}/>
                                    </div>
                                    Dollar ($)
                                </Button>
                                <Button
                                    type="button"
                                    variant='ghost'
                                    onClick={toggleBrokerageType}
                                >
                                    <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                        <LuCircle className={cn(
                                            "h-2.5 w-2.5 hidden",
                                            brokerageType!=='$' && "block fill-slate-700"
                                        )}/>
                                    </div>
                                    Percentage (%)
                                </Button>
                            </div>
                            {brokerageType==='$' ? (
                            <div className="flex items-center gap-2 text-slate-800">
                                $
                                <Input 
                                    type="number"
                                    min={0}
                                    name="brokerage"
                                    data-name="Brokerage"
                                    value={formData.brokerage.dollar}
                                    onChange={onDataChange}
                                    className="text-lg w-[80px] bg-transparent text-slate-800"
                                />
                            </div>
                            ) : (
                            <div className="flex items-center gap-2 text-slate-800">
                                <Input 
                                    type="number"
                                    min={0}
                                    name="brokerage"
                                    data-name="Brokerage"
                                    value={formData.brokerage.dollar}
                                    onChange={onDataChange}
                                    className="text-lg w-[80px] bg-transparent text-slate-800"     
                                />
                                %
                            </div>
                            )}
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-lg text-slate-800">Objective</div>
                            <div className="text-lg text-slate-800">{formData.objective}</div>
                        </div>
                    </form>
                    <div className="flex items-center justify-center gap-8">
                    {confirmDelete && !loading && (
                        <>
                            <div className="text-lg text-[#dc2b2b]">Are you sure?</div>
                            <Button variant="ghost" onClick={onDelete}>
                                <LuCheck
                                    size={20}
                                    className="cursor-pointer transition-colors duration-300 text-[#dc2b2b]"
                                />
                            </Button>
                        </>
                    )}
                    {!confirmDelete && !loading && (
                        <>
                            <div className="text-lg text-[#dc2b2b]">Delete Portfolio</div>
                            <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                                <LuTrash
                                    size={20}
                                    className="cursor-pointer transition-colors duration-300 text-[#dc2b2b]"
                                />
                            </Button>
                        </>
                    )}
                    {loading && (
                        <div className="text-lg text-[#dc2b2b]">Deleting...</div>
                    )}
                    </div>
                </div>
                <div className="grid gap-6 grid-cols-2 items-center">
                    <DialogClose asChild>
                        <Button
                            ref={closeRef}
                            type="button"
                            variant="secondary"
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            onClick={() => {}}
                            type="button"
                        >
                            Done
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
