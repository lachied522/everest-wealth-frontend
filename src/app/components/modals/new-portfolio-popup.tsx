"use client";
import { useState, useRef, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select" 
  
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useGlobalContext, type GlobalState } from "@/context/GlobalState";

const FormSchema = z.object({
    name: z.string().default('My Portfolio'),
    entity: z.string().default('individual'),
    objective: z.string({
        required_error: "Please select an objective for this portfolio"
    }),
    percentBrokerage: z.coerce.number().optional(),
    flatBrokerage: z.coerce.number().optional(),
    value: z.coerce.number().min(0).optional(),
})

export default function NewPortfolioPopup({ children } : {
    children: ReactNode
}) {
    const { createPortfolio } = useGlobalContext() as GlobalState;
    const [currentStep, setCurrentStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const closeRef = useRef<HTMLButtonElement | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    });

    const onSuccess = useCallback((data: any) => {
        // create new portfolio in global state
        createPortfolio(data);
        // navigate to new portfolio
        router.replace(`/portfolio/${data.id}?tab=overview`);
        if (closeRef.current) closeRef.current.click(); // close modal
    }, [router, createPortfolio]);

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        const data = await fetch('/api/new-portfolio', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((res) => {
            if (!res.ok) throw new Error('Api error');
            return res.json();
        })
        .catch((err) => console.log(err));

        if (data) onSuccess(data);

        setIsLoading(false);
    }

    const onClose = () => {
        // reset state
        setCurrentStep(0);
        setIsLoading(false);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Portfolio</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="min-h-[60vh] flex flex-col items-center justify-between gap-12 p-8">
                        {currentStep===0 && (
                        <>
                            <div className="w-full grid grid-cols-2 items-center justify-start gap-8">
                                <div className="text-lg text-slate-800">Portfolio Name</div>
                                <FormField 
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="My Portfolio"
                                                    className='max-w-[240px]'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 items-center justify-start gap-8">
                                <div className="text-lg text-slate-800">Investment Entity</div>
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
                                                    <SelectTrigger className="text-slate-700">
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
                            </div>
                            <div className="flex flex-col items-center justify-start gap-8">
                                <div className="text-lg text-slate-800">What is the objective of this portfolio?</div>
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
                            <div className="w-full grid grid-cols-2 items-center gap-6">
                                <DialogClose asChild>
                                    <Button
                                        ref={closeRef}
                                        variant="secondary"
                                        type="button"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>
                                {!isLoading ? (
                                <Button 
                                    type="submit" 
                                    onClick={() => console.log(form.formState.errors)}
                                >
                                    Submit
                                </Button>
                                ) : (
                                <Button type="button" disabled>Please wait...</Button>
                                )}
                            </div>
                        </>
                        )}
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}