"use client";
import { useState, useRef } from "react";
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
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select" 
  
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { cn } from "@/components/lib/utils"

import { LuPlus, LuCircle } from "react-icons/lu";

const FormSchema = z.object({
    name: z.string().optional(),
    objective: z.string({
        required_error: "Please select an objective for this portfolio"
    }),
    percentBrokerage: z.coerce.number().optional(),
    flatBrokerage: z.coerce.number().optional(),
    value: z.coerce.number().min(0).optional(),
})

export default function NewPortfolioPopup() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(0)
    const [brokerageType, setBrokerageType] = useState<"$" | "%">("$")
    const [isExistingPortfolio, setIsExistingPortfolio] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const closeRef = useRef<HTMLButtonElement | null>(null)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        
        console.log(values)
        return
        setIsLoading(true)
        const res = await fetch('/api/new-portfolio', {
            method: "POST",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            router.push(res.url);
        }
    }

    const toggleBrokerageType = () => {
        if (brokerageType === "%") {
            setBrokerageType("$");
        } else {
            setBrokerageType("%");
        }
    }

    const onClose = () => {
        if (closeRef.current) closeRef.current.click();
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <LuPlus
                        className="mr-2"
                    />
                    New Portfolio
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Portfolio</DialogTitle>
                </DialogHeader>
                <Form {...form}>
            <form className="flex flex-col items-center justify-items-center gap-16 px-2">
                {currentStep===0 && (
                <>
                <div className="grid grid-cols-2 items-center justify-start">
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
                <div className="grid grid-cols-2 items-center justify-start">
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
                <div className="w-full grid grid-cols-2 items-center gap-6">
                    <DialogClose asChild>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {}}
                        >
                        Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        onClick={() => setCurrentStep(1)}
                        type="button"
                    >
                        Next
                    </Button>
                </div>
                </>
                )}
                {currentStep===1 && (
                <>
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
            
                {true && (
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
                    <div className="w-full grid grid-cols-2 items-center gap-6">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => setCurrentStep(0)}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => console.log(form.formState.errors)}
                        type="submit"
                    >
                        Submit
                    </Button>
                </div>
                </>)}
                </>)}
            </form>
        </Form>
            </DialogContent>
        </Dialog>
    )
}