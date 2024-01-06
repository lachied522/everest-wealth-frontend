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

import { LuCircle } from "react-icons/lu"
import { cn } from "@/components/lib/utils"

import PortfolioEditor from "./portfolio-editor";
import ObjectiveSelector from "@/components/objective-selector"

export const FormSchema = z.object({
    name: z.string().default('My Portfolio'),
    entity: z.string().default('individual'),
    objective: z.string({
        required_error: "Please select an objective for this portfolio"
    }),
    holdings: z.object({
        symbol: z.string(),
        units: z.number(),
        cost: z.number(),
    }).array().default([]),
    value: z.coerce.number().min(0).optional(),
})

type Holding = {
    symbol: string
    units: number
    cost: number
}

type Data = {
    name: string
    entity: string
    objective: string
    holdings?: Holding[]
    value?: number
}

interface NewPortfolioFormProps {
    onSuccess: (values: Data) => void
    navigateBack: () => void
}

export const NewPortfolioForm = ({ onSuccess, navigateBack }: NewPortfolioFormProps) => {
    const [isExistingPortfolio, setIsExistingPortfolio] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        setIsLoading(true)
        onSuccess(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="max-w-6xl p-6">
                    <div className="flex flex-col justify-center mb-4">
                        <h2>Create your first portfolio</h2>
                        <p className="text-lg text-slate-800 w-[660px]">
                            You may add an existing portfolio or we can recommend one for
                            you.
                        </p>
                    </div>
                    <Card className="flex flex-col gap-16 items-center p-16 m-4">
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
                        <div className="text-base text-slate-800">Investment Entity</div>
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
                                            <SelectItem value="Super">Super Fund</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <div className="text-lg text-slate-800">
                            What is the objective for this portfolio?
                        </div>
                        <FormField 
                            control={form.control}
                            name="objective"
                            render={({field}) => (
                                <ObjectiveSelector handleChange={field.onChange} value={field.value} />
                            )}
                        />
                        <div className="text-lg text-slate-800">
                            Would you like us to make a recommendation for this portfolio?
                        </div>
                        <div className="flex gap-8">
                            <Button
                                type="button"
                                variant='ghost'
                                onClick={() => setIsExistingPortfolio(!isExistingPortfolio)}
                            >
                                <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                    <LuCircle className={cn(
                                        "h-2.5 w-2.5 hidden",
                                        !isExistingPortfolio && "block fill-slate-700"
                                    )}/>
                                </div>
                                Yes please
                            </Button>
                            <Button
                                type="button"
                                variant='ghost'
                                onClick={() => setIsExistingPortfolio(!isExistingPortfolio)}
                            >
                                <div className="h-4 w-4 rounded-full border flex items-center justify-center mr-2">
                                    <LuCircle className={cn(
                                        "h-2.5 w-2.5 hidden",
                                        isExistingPortfolio && "block fill-slate-700"
                                    )}/>
                                </div>
                                No, I have an existing portfolio
                            </Button>
                        </div>
                        {isExistingPortfolio ? (
                        <FormField 
                            control={form.control}
                            name="holdings"
                            render={({field}) => (
                                <PortfolioEditor onChange={field.onChange} />
                            )}
                        />
                        ) : (
                        <>
                            <div className="text-lg text-slate-800">
                                What is the intended value of this portfolio?
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
                    </Card>
                    <div className="flex justify-between mt-6">
                        <Button type="button" onClick={navigateBack}>Back</Button>
                        {!isLoading && <Button type="submit" onClick={() => console.log(form.formState.errors)}>Next</Button>}
                        {isLoading && <Button type="button" disabled>Please wait...</Button>}
                    </div>
                </div>
            </form>
        </Form>
    )
}