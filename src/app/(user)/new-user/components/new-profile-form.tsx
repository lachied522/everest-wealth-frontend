"use client"

/* 
 *  copied from (main)/profile/profile-form
 */

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { LuUser2 } from "react-icons/lu"

import IndustryPreferences from "@/components/industry-preferences"

import type { Tables } from "@/types/supabase";

export const FormSchema = z.object({
    country: z.string().nullable(),
    employment: z.string().nullable(),
    salary: z.coerce.number().nullable(),
    assets: z.coerce.number().nullable(),
    borrowing: z.coerce.boolean().nullable(),
    experience: z.coerce.number().nullable(),
    risk_tolerance_q1: z.coerce.number().nullable(),
    risk_tolerance_q2: z.coerce.number().nullable(),
    risk_tolerance_q3: z.coerce.number().nullable(),
    risk_tolerance_q4: z.coerce.number().nullable(),
    international: z.number().array().transform((val) => val[0]).nullable(),
    passive: z.number().array().transform((val) => val[0]).nullable(),
    preferences: z.object({}).nullable(),
})

interface NewProfileFormProps {
    onSuccess: (values: Omit<Tables<'profiles'>, 'id'|'DOB'|'created_at'|'user_id'>) => void
}

export const NewProfileForm = ({ onSuccess } : NewProfileFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    })

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        onSuccess(values)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl flex flex-col gap-6 p-6 space-y-8">
                <div className="flex items-center gap-4 mb-4">
                    <LuUser2 size={48} />
                    <div className="flex flex-col justify-center gap-2">
                        <h3 className="text-xl font-medium">Your Profile</h3>
                        <p className="text-slate-800 w-[660px]">
                            Your profile helps us make recommendations that are
                            appropriate for you. It is important to make sure your profile
                            is update to date.
                        </p>
                    </div>
                </div>
                {/* profile form copied from (main)/profile/components/profile-form */}
                <div>
                    <h4 className="text-lg font-medium mb-6">Finances</h4>
                    <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16 m-4">
                    <div className="w-full text-left text-lg text-slate-800">
                        Employment type
                    </div>
                    <FormField
                        control={form.control}
                        name="employment"
                        render={({ field }) => (
                        <FormItem>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                            >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select one..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="part-time">Part Time</SelectItem>
                                <SelectItem value="full-time">Full Time</SelectItem>
                                <SelectItem value="freelance">Freelance</SelectItem>
                                <SelectItem value="retired">Retired</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    <div className="w-full text-left text-lg text-slate-800">
                        What proportion of your monthly income do you usually
                        invest?
                    </div>
                    <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                        <FormItem>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value)}
                            >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select one..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="1">1% - 5%</SelectItem>
                                <SelectItem value="2">5% - 10%</SelectItem>
                                <SelectItem value="3">10% - 25%</SelectItem>
                                <SelectItem value="4">25% - 50%</SelectItem>
                                <SelectItem value="5">50% +</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    <div className="w-full text-left text-lg text-slate-800">
                        What proportion of your net worth does your portfolio make
                        up?
                    </div>
                    <FormField
                        control={form.control}
                        name="assets"
                        render={({ field }) => (
                        <FormItem>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value)}
                            >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select one..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="0">0% - 10%</SelectItem>
                                <SelectItem value="1">10% - 25%</SelectItem>
                                <SelectItem value="2">25% - 50%</SelectItem>
                                <SelectItem value="3">50% - 75%</SelectItem>
                                <SelectItem value="4">75% +</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    <div className="w-full text-left text-lg text-slate-800">
                        Are you borrowing to invest in shares?
                    </div>
                    <FormField
                        control={form.control}
                        name="borrowing"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                                className="flex items-center justify-center gap-4"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="true" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="false" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    </Card>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-6">Experience</h4>
                    <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16 m-4">
                    <div className="text-lg text-slate-800">
                        How many years&#x27; experience do you have investing in
                        stocks?
                    </div>
                    <FormField
                        control={form.control}
                        name="risk_tolerance_q1"
                        render={({ field }) => (
                        <FormItem>
                            <Select
                            onValueChange={field.onChange}
                            defaultValue={String(field.value)}
                            >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select one..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="0">0</SelectItem>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5 +</SelectItem>
                            </SelectContent>
                            </Select>
                        </FormItem>
                        )}
                    />
                    </Card>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-6">Risk Tolerance</h4>
                    <Card className="grid grid-cols-1 items-center justify-items-stretch gap-12 p-16 m-4">
                    <div className="text-lg text-slate-800">
                        Which of the following best describes your association with
                        financial risk?
                    </div>
                    <FormField
                        control={form.control}
                        name="risk_tolerance_q1"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                                className="w-full grid grid-cols-5 items-center justify-center gap-4 p-4"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Danger
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="2" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Uncertainty
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="3" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Indifference
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="4" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Opportunity
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="5" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Thrill
                                </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <div className="text-lg text-slate-800">
                        What is your willingness to take on financial risk?
                    </div>
                    <FormField
                        control={form.control}
                        name="risk_tolerance_q2"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                                className="w-full grid grid-cols-5 items-center justify-center gap-4 p-4"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Very low
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="2" />
                                </FormControl>
                                <FormLabel className="font-normal">Low</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="3" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Average
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="4" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    High
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="5" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    Very high
                                </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <div className="text-lg text-slate-800">
                        What range of returns do you expect to receive from your
                        portfolio?
                    </div>
                    <FormField
                        control={form.control}
                        name="risk_tolerance_q3"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                                className="w-full grid grid-cols-5 items-center justify-center gap-4 p-4"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    4% to 5%
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="2" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    2% to 6%
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="3" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    0% to 7%
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="4" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    -2% to 10%
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="5" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    -5% to 20%
                                </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <div className="text-lg text-slate-800">
                        How much could the <strong>total value</strong> of all your
                        portfolio fall before you begin to feel uncomfortable?
                    </div>
                    <FormField
                        control={form.control}
                        name="risk_tolerance_q4"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={String(field.value)}
                                className="w-full grid grid-cols-5 items-center justify-center gap-4 p-4"
                            >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="1" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    &lt;10%
                                </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="2" />
                                </FormControl>
                                <FormLabel className="font-normal">10%</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="3" />
                                </FormControl>
                                <FormLabel className="font-normal">20%</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="4" />
                                </FormControl>
                                <FormLabel className="font-normal">30%</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value="5" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                    &gt;50%
                                </FormLabel>
                                </FormItem>
                            </RadioGroup>
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    </Card>
                </div>
                <div>
                    <h4 className="text-lg font-medium mb-6">Preferences</h4>
                    <Card className="flex flex-col gap-12 items-center p-16 m-4">
                    <div className="flex flex-col gap-12 items-center">
                        <div className="text-lg text-slate-800">
                            What proportion of your portfolio do you wish to invest in
                            international stocks?
                        </div>
                        <FormField
                            control={form.control}
                            name="international"
                            render={({ field }) => (
                                <FormItem className="flex gap-4 justify-stretch">
                                <span>0</span>
                                <FormControl>
                                    <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    defaultValue={[field.value || 50]}
                                    onValueChange={field.onChange}
                                    className="w-[240px] cursor-pointer"
                                    />
                                </FormControl>
                                <span>100</span>
                                </FormItem>
                            )}
                        />
                        <div className="text-lg text-slate-800">
                            What proportion of your portfolio do you wish to invest in
                            ETFs?
                        </div>
                        <FormField
                            control={form.control}
                            name="passive"
                            render={({ field }) => (
                                <FormItem className="flex gap-4 justify-stretch">
                                <span>0</span>
                                <FormControl>
                                    <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    defaultValue={[field.value || 50]}
                                    onValueChange={field.onChange}
                                    className="w-[240px] cursor-pointer"
                                    />
                                </FormControl>
                                <span>100</span>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="text-lg text-slate-800">
                        Do you have any industry preferences?
                    </div>
                    <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                            <IndustryPreferences
                                handleChange={field.onChange}
                                value={field.value}
                            />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    </Card>
                </div>
                <div className="flex justify-end mt-6">
                    <Button
                        type="submit"
                        onClick={() => console.log(form.formState.errors)}
                    >
                        Next
                    </Button>
                </div>
            </form>
        </Form>
    )
}