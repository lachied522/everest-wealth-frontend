"use client";
import { useState, useEffect, useRef, useCallback } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
    LuSettings,
    LuSettings2,
    LuTrash,
    LuCheck,
    LuCircle,
    LuBarChartBig,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/components/lib/utils";

import IndustryPreferences from "@/components/industry-preferences";

import { GlobalState, useGlobalContext } from "@/context/GlobalState";
import { PortfolioState, usePortfolioContext } from "../../context/PortfolioState";

import type { PortfolioData } from "@/types/types";

type FormData = Pick<PortfolioData, 'name'|'objective'|'entity'|'flat_brokerage'|'active'|'international'|'preferences'>

export const FormSchema = z.object({
    name: z.string(),
    entity: z.string().nullable(),
    objective: z.string({
      required_error: "Please select an objective for this portfolio",
    }),
    percentBrokerage: z.coerce.number().optional(),
    flatBrokerage: z.coerce.number().optional(),
    active: z.number().nullable(),
    international: z.number().nullable(),
    preferences: z.record(
        z.string(),
        z.union([z.literal("like"), z.literal("dislike")]),
    ).nullable(),
});

export default function PortfolioSettingsPopup() {
    const { updatePortfolioSettings, onPortfolioDelete } = useGlobalContext() as GlobalState;
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const [openTab, setOpenTab] = useState<'settings' | 'preferences'>('settings');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [brokerageType, setBrokerageType] = useState("$");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);

  if (!currentPortfolio) throw new Error('currentPortfolio undefined');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        // update form values on portfolio change
        if (currentPortfolio) form.reset(currentPortfolio);
    }, [currentPortfolio, form]);

    const commitChanges = useCallback(
        async (data: Partial<FormData>): Promise<boolean> => {
            const res = await fetch(
                '/api/commit-portfolio-settings-and-preferences',
                {
                    method: "POST",
                    body: JSON.stringify({
                        portfolio_id: currentPortfolio.id,
                        data,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            return res.ok;
        },
        [currentPortfolio.id]
    );

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);

        // construct new object of portfolio data only if value has changed
        const newValues: Partial<FormData> = Object.entries(values).reduce(
            (obj, [key, value]) => {
                if (key in form.formState.dirtyFields) {
                    // key has been changed
                    return {
                        ...obj,
                        [key]: value,
                    }
                }
                return obj;
            }, 
            {}
        );

        // handle brokerage logic
        if (brokerageType==="$" && values.flatBrokerage!==currentPortfolio!.flat_brokerage) {
            newValues['flat_brokerage'] = values.flatBrokerage!;
        } else if (brokerageType==="%") {
            // not implemented
            // newValues['percent_brokerage'] = values.percentBrokerage;
        }

        let success = false;
        if (Object.keys(newValues).length > 0) {
            // if there are new values
            success = await commitChanges(newValues);

            if (success) {
                updatePortfolioSettings(currentPortfolio!.id, newValues);
            }
        } else {
            console.log("no changes");
        }

        // close module
        if (success && closeRef.current) closeRef.current.click();
    }

    const onDelete = async () => {
        // delete portfolio
        setLoadingDelete(true);
        const success = await onPortfolioDelete(currentPortfolio.id);
        // close dialog
        if (success && closeRef.current) closeRef.current.click();
    };

    const onClose = () => {
        // wait for dialog to close, then reset state
        setTimeout(() => {
            if (form.formState.isDirty) form.reset(currentPortfolio);

            setIsLoading(false);
            setConfirmDelete(false);
            setLoadingDelete(false);
        }, 300);
    };

    const toggleBrokerageType = () => {
        if (brokerageType === "%") {
            setBrokerageType("$");
        } else {
            setBrokerageType("%");
        }
    };

    return (
        <div className="flex gap-4 sm:gap-2 items-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" className="text-slate-800">
                        <LuSettings2 size={20} className="text-slate-700" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Portfolio Settings</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            type="button"
                            variant={openTab==='settings' ? 'default': 'secondary'}
                            onClick={() => {setOpenTab('settings')}}
                        >
                            <LuSettings className="mr-2"/>
                            Settings
                        </Button>
                        <Button
                            type="button"
                            variant={openTab==='preferences' ? 'default': 'secondary'}
                            onClick={() => {setOpenTab('preferences')}}
                        >
                            <LuBarChartBig className="mr-2"/>
                            Preferences
                        </Button>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            {openTab==='settings' && (
                            <ScrollArea className="h-[60vh] my-6">
                                <div className="flex flex-col items-stretch justify-items-between gap-12 p-6">
                                    <div className="grid grid-cols-[0.75fr,1fr] grid-rows-3 items-center justify-between gap-6">
                                        <div className="text-base text-slate-800">Portfolio Name</div>
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            maxLength={20}
                                                            placeholder="My Portfolio"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            className="w-[240px] bg-transparent text-base text-slate-800"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="text-base text-slate-800">Investment Entity</div>
                                        <FormField
                                            control={form.control}
                                            name="entity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={String(field.value)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-[240px] text-slate-700">
                                                                <SelectValue placeholder="Select one..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="individual">Individual</SelectItem>
                                                            <SelectItem value="joint">Joint</SelectItem>
                                                            <SelectItem value="company">Company</SelectItem>
                                                            <SelectItem value="trust">Trust</SelectItem>
                                                            <SelectItem value="super">Super Fund</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="text-base text-slate-800">Objective</div>
                                        <FormField
                                            control={form.control}
                                            name="objective"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={String(field.value)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-[240px] text-slate-700">
                                                                <SelectValue placeholder="Select one..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Long-term/Retirement Savings">Long-term/Retirement Savings</SelectItem>
                                                            <SelectItem value="Passive Income">Passive Income</SelectItem>
                                                            <SelectItem value="Capital Preservation">Capital Preservation</SelectItem>
                                                            <SelectItem value="First Home">First Home</SelectItem>
                                                            <SelectItem value="Children">Children</SelectItem>
                                                            <SelectItem value="Trading">Trading</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>                                   
                                    <div className="flex flex-col place-items-center gap-8">
                                        <div className="text-lg text-center text-slate-800">
                                            Brokerage
                                        </div>
                                        <div className="flex gap-8">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={toggleBrokerageType}
                                            disabled
                                        >
                                            <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                            <LuCircle
                                                className={cn(
                                                "h-2.5 w-2.5 hidden",
                                                brokerageType === "$" && "block fill-slate-700"
                                                )}
                                            />
                                            </div>
                                            Dollar ($)
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={toggleBrokerageType}
                                            disabled
                                        >
                                            <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                            <LuCircle
                                                className={cn(
                                                "h-2.5 w-2.5 hidden",
                                                brokerageType !== "$" && "block fill-slate-700"
                                                )}
                                            />
                                            </div>
                                            Percentage (%)
                                        </Button>
                                        </div>
                                        {brokerageType === "$" ? (
                                        <div className="flex items-center gap-2 text-slate-800">
                                            $
                                            <FormField
                                            control={form.control}
                                            name="flatBrokerage"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="text-lg w-[80px] bg-transparent text-slate-800"
                                                    />
                                                </FormControl>
                                                </FormItem>
                                            )}
                                            />
                                        </div>
                                        ) : (
                                        <div className="flex items-center gap-2 text-slate-800">
                                            <FormField
                                            control={form.control}
                                            name="percentBrokerage"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        className="text-lg w-[80px] bg-transparent text-slate-800"
                                                    />
                                                </FormControl>
                                                </FormItem>
                                            )}
                                            />
                                            %
                                        </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {confirmDelete && !loadingDelete && (
                                        <>
                                            <div className="text-lg text-[#dc2b2b]">Are you sure?</div>
                                            <Button type="button" variant="ghost" onClick={onDelete}>
                                                <LuCheck
                                                    size={20}
                                                    className="cursor-pointer transition-colors duration-300 text-[#dc2b2b]"
                                                />
                                            </Button>
                                        </>
                                        )}
                                        {!confirmDelete && !loadingDelete && (
                                        <>
                                            <div className="text-lg text-[#dc2b2b]">
                                                Delete Portfolio
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setConfirmDelete(true)}
                                            >
                                            <LuTrash
                                                size={20}
                                                className="cursor-pointer transition-colors duration-300 text-[#dc2b2b]"
                                            />
                                            </Button>
                                        </>
                                        )}
                                        {loadingDelete && (
                                        <div className="text-lg text-[#dc2b2b]">Deleting...</div>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>
                            )}
                            {openTab==='preferences' && (
                            <ScrollArea className="h-[60vh] my-6">
                                <div className="flex flex-col items-stretch justify-items-between gap-12 p-6">
                                    <div>
                                        <div className="text-base text-slate-800 mb-3">
                                            Portion of your portfolio invested in ETFs
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="active"
                                            render={({ field }) => (
                                                <FormItem className="flex gap-4 space-y-0 items-center justify-center">
                                                    <FormControl>
                                                        <Slider
                                                            min={0}
                                                            max={100}
                                                            step={1}
                                                            defaultValue={[field.value || 50]}
                                                            onValueChange={(value: number[]) => field.onChange(value[0])}
                                                            className="w-[240px] cursor-pointer"
                                                        />
                                                    </FormControl>
                                                    <div className="font-semibold">{field.value}</div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-base text-slate-800 mb-3">
                                            Portion of your portfolio invested in international stocks
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="international"
                                            render={({field}) => (
                                                <FormItem className="flex gap-4 space-y-0 items-center justify-center">
                                                    <FormControl>
                                                        <Slider
                                                            min={0}
                                                            max={100}
                                                            step={1}
                                                            defaultValue={[field.value || 50]}
                                                            onValueChange={(value: number[]) => field.onChange(value[0])}
                                                            className="w-[240px] cursor-pointer"
                                                        />
                                                    </FormControl>
                                                    <div className="font-semibold">{field.value}</div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <div className="text-base text-slate-800 mb-6">
                                            Sector Preferences
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="preferences"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <IndustryPreferences handleChange={field.onChange} value={field.value} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
                            )}
                            <div className="w-full grid grid-cols-2 items-center gap-6">
                                <DialogClose asChild>
                                    <Button
                                        ref={closeRef}
                                        type="button"
                                        variant="secondary"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                {isLoading ? (
                                <Button type="button" disabled>
                                    Please wait...
                                </Button>
                                ) : (
                                <Button type="submit" onClick={() => console.log(form.formState.errors)}>
                                    Done
                                </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <div className="text-xl font-medium text-slate-800 mb-0">
                {currentPortfolio.name}
            </div>
        </div>
    );
}
