"use client";
import { useState, useEffect, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
  LuSettings,
  LuTrash,
  LuCheck,
  LuCircle,
  LuLoader2,
} from "react-icons/lu";
import { cn } from "@/components/lib/utils";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useGlobalContext } from "@/context/GlobalState";
import { usePortfolioContext } from "../../context/PortfolioState";

export const FormSchema = z.object({
  name: z.string().optional(),
  percentBrokerage: z.coerce.number().optional(),
  flatBrokerage: z.coerce.number().optional(),
  objective: z.string({
    required_error: "Please select an objective for this portfolio",
  }),
});

export default function PortfolioSettingsPopup() {
    const { updatePortfolioSettings, onPortfolioDelete } = useGlobalContext();
    const { currentPortfolio } = usePortfolioContext();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [brokerageType, setBrokerageType] = useState("$");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    useEffect(() => {
        // update form values on portfolio change
        if (currentPortfolio) {
            form.reset({
                name: currentPortfolio?.name,
                objective: currentPortfolio?.objective,
                percentBrokerage: 0,
                flatBrokerage: currentPortfolio?.flat_brokerage,
            });
        }
    }, [currentPortfolio, form]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        // construct new object of portfolio data only if value has changed
        const newValues: {[key: string]: any} = new Object();
        if (values.name!==currentPortfolio.name) newValues['name'] = values.name;
        if (values.objective!==currentPortfolio.objective) newValues['objective'] = values.objective;

        if (brokerageType==="$" && values.flatBrokerage!==currentPortfolio['flat_brokerage']) {
            newValues['flat_brokerage'] = values.flatBrokerage;
        } else if (brokerageType==="%" && values.percentBrokerage!==currentPortfolio['percent_brokerage']) {
            newValues['percent_brokerage'] = values.percentBrokerage;
        }

        if (Object.keys(newValues).length > 0) {
            // if there are new values
            const success = await updatePortfolioSettings(currentPortfolio.id, newValues);
            if (success && closeRef.current) closeRef.current.click();
        } else {
            // if (closeRef.current) closeRef.current.click();
            console.log("no changes")
        }
    }

    const onDelete = async () => {
        // delete portfolio
        setLoadingDelete(true);
        const success = await onPortfolioDelete(currentPortfolio.id);
        // close dialog
        if (success && closeRef.current) closeRef.current.click();
    };

    const onClose = () => {
        // wait for dialog to close, then reset form
        setTimeout(() => {
            form.reset({
                name: currentPortfolio?.name,
                objective: currentPortfolio?.objective,
                percentBrokerage: 0,
                flatBrokerage: currentPortfolio?.flat_brokerage,
            });

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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="text-slate-800">
                    <LuSettings size={24} className="text-slate-700" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Portfolio Settings</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-16 py-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center justify-items-center gap-16 px-2">
                    <div className="grid grid-cols-[0.75fr,1fr] items-center justify-start">
                        <div className="text-lg text-slate-800">Portfolio Name</div>
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
                                className="text-lg w-[240px] bg-transparent text-slate-800"
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                    </div>
                    <div className="grid grid-cols-[0.75fr,1fr] items-center justify-start">
                        <div className="text-lg text-slate-800">Objective</div>
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
                                <SelectItem value="Long-term/Retirement Savings">
                                    Long-term/Retirement Savings
                                </SelectItem>
                                <SelectItem value="Passive Income">
                                    Passive Income
                                </SelectItem>
                                <SelectItem value="Capital Preservation">
                                    Capital Preservation
                                </SelectItem>
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
                    <div className="flex items-center justify-center gap-8">
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
                        {isLoading? (
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
                </div>
            </DialogContent>
        </Dialog>
    );
}
