"use client";
import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
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
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider";

import { LuCircle } from "react-icons/lu"
import { BiBriefcaseAlt } from "react-icons/bi";
import { cn } from "@/components/lib/utils"

import IndustryPreferences from "@/components/custom/industry-preferences"
import ObjectiveSelector from "@/components/custom/objective-selector"

import PortfolioEditor from "./portfolio-editor";
import LinkPopup from "./link-broker";

export const FormSchema = z.object({
    name: z.string().default('My Portfolio'),
    entity: z.string().default('individual'),
    objective: z.string({
        required_error: "Please select an objective for this portfolio"
    }),
    active: z.number().nullable().default(70),
    preferences: z.record(
        z.string(),
        z.union([z.literal("like"), z.literal("dislike")]),
    ).nullable(),
    holdings: z.object({
        symbol: z.string(),
        units: z.number(),
        cost: z.number().optional(),
    }).array().optional().default([]),
    value: z.coerce.number().min(0).optional(),
    publicToken: z.string().optional(),
})

interface NewPortfolioFormProps {
    onSuccess: (values: z.infer<typeof FormSchema>) => void
    navigateBack: () => void
}

export const NewPortfolioForm = ({ onSuccess, navigateBack }: NewPortfolioFormProps) => {
    const [portfolioType, setPortfolioType] = useState<'link'|'manual'|'new'|'dummy'>('dummy'); // 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        onSuccess(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl flex flex-col items-center gap-12 p-6 space-y-8">
                <div className="flex items-center gap-6 mb-4 mx-auto">
                    <BiBriefcaseAlt size={42} />
                    <div className="flex flex-col justify-center gap-2">
                        <h3 className="text-xl font-medium">Create your first portfolio</h3>
                        <p className="text-slate-800 w-[660px]">
                            You may link an existing portfolio or start from scratch.
                        </p>
                    </div>
                </div>
                <Card className="flex flex-col gap-36 items-center p-16 pb-48 m-4">
                    <div className="grid grid-cols-2 place-items-center gap-16">
                        <div className="text-lg font-medium text-slate-800">Portfolio Name</div>
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
                        <div className="text-lg font-medium text-slate-800">Investment Entity</div>
                        <FormField
                            control={form.control}
                            name="entity"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
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
                    </div>
                    <div className="flex flex-col gap-12 items-center">
                        <h3 className="text-2xl font-medium">Objective</h3>
                        <FormField 
                            control={form.control}
                            name="objective"
                            render={({field}) => (
                                <ObjectiveSelector handleChange={field.onChange} value={field.value} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-24 items-center">
                        <h3 className="text-2xl font-medium">Preferences</h3>
                        <div className="text-lg font-medium text-slate-800">
                            What proportion of your portfolio do you wish to invest in
                            ETFs?
                        </div>
                        <FormField
                            control={form.control}
                            name="active"
                            render={({ field }) => (
                                <FormItem className="flex gap-5 space-y-0 items-center justify-center">
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
                                    <div className="text-lg font-semibold">{field.value || 50}%</div>
                                </FormItem>
                            )}
                        />
                        <div className="max-w-[80%] text-center text-lg text-slate-800">
                            Select market sectors you like or dislike below. The recommendations we make for your portfolio will be adjusted to match what you select.
                        </div>
                        <FormField
                            control={form.control}
                            name="preferences"
                            render={({ field }) => (
                            <FormItem className="max-w-[560px]">
                                <FormControl>
                                    <IndustryPreferences
                                        handleChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-16 items-center">
                        <div className="text-lg font-medium text-slate-800">
                            Do you have an existing broker account you would like to link to this portfolio?
                        </div>
                        <div className="flex gap-8">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setPortfolioType("manual")}
                            >
                                <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                    <LuCircle
                                        className={cn(
                                            "h-2.5 w-2.5 hidden",
                                            portfolioType!=="new" && "block fill-slate-700"
                                        )}
                                    />
                                </div>
                                Yes
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setPortfolioType("new")}
                            >
                                <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                    <LuCircle
                                        className={cn(
                                            "h-2.5 w-2.5 hidden",
                                            portfolioType==="new" && "block fill-slate-700"
                                        )}
                                    />
                                </div>
                                No, I&apos;m starting fresh
                            </Button>
                        </div>
                        {portfolioType!=="new" ? (
                        <>
                            <div className="text-lg font-medium text-slate-800">
                                Select one of the below options
                            </div>
                            <div className="flex gap-8">
                                <FormField 
                                    control={form.control}
                                    name="publicToken"
                                    render={({ field }) => (
                                        <div onClick={() => setPortfolioType("link")}>
                                            <LinkPopup setPublicToken={field.onChange} />
                                        </div>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setPortfolioType("manual")}
                                >
                                    <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                        <LuCircle className={cn(
                                            "h-2.5 w-2.5 hidden",
                                            portfolioType==="manual" && "block fill-slate-700"
                                        )}/>
                                    </div>
                                    Add investments manually
                                </Button>
                            </div>
                            {portfolioType==="manual" && (
                            <FormField 
                                control={form.control}
                                name="holdings"
                                render={({field}) => (
                                    <PortfolioEditor onChange={field.onChange} />
                                )}
                            />
                            )}
                        </>
                        ) : (
                        <>
                            <div className="flex flex-col items-center gap-3 text-center">
                                <div className="text-lg font-medium text-slate-800">
                                    What is the intended value of this portfolio?
                                </div>
                                <p>This will inform the recommendations we make for this portfolio.</p>
                            </div>
                            <FormField
                                control={form.control}
                                name="value"
                                render={({field}) => (
                                    <FormItem className="flex gap-2 items-center">
                                        <div className="mt-2">$</div>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="e.g. 10,000"
                                                className='max-w-[25%] min-w-[200px]'
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />                        
                        </>
                        )}
                    </div>
                </Card>
                <div className="w-full flex justify-between mt-6">
                    <Button 
                        type="button"
                        variant="secondary"
                        onClick={navigateBack}
                    >
                        Back
                    </Button>
                    {!isLoading ? (
                    <Button type="submit" onClick={() => console.log(form.formState.errors)}>Submit</Button>
                    ) : (
                    <Button type="button" disabled>Creating portfolio...</Button>
                    )}
                </div>
            </form>
        </Form>
    )
}