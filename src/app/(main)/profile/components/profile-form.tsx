"use client";
/* 
 *  https://ui.shadcn.com/docs/components/form 
 */

import { useCallback, useState } from "react"

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

import { LuPencil, LuSave, LuMapPin } from "react-icons/lu"

import DOBPicker from "./dob-picker";
import IndustryPreferences from "@/components/industry-preferences"

import type { Tables, TablesInsert } from "@/types/supabase";

const FormSchema = z.object({
    DOB: z.date().max(new Date(), { message: "Please select a valid DOB" }),
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

interface ProfileFormProps {
    data: Tables<'profiles'>
    userName: string
}

export default function ProfileForm({ data, userName } : ProfileFormProps) {
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            employment: data.employment,
            salary: data.salary,
            assets: data.assets,
            borrowing: data.borrowing,
            experience: data.experience,
            risk_tolerance_q1: data.risk_tolerance_q1 || 3,
            risk_tolerance_q2: data.risk_tolerance_q2 || 3,
            risk_tolerance_q3: data.risk_tolerance_q3 || 3,
            risk_tolerance_q4: data.risk_tolerance_q4 || 3,
            international: data.international || 50, // slider values must take array
            passive: data.passive || 50, // slider values must take array
            preferences: data.preferences || {},
        },
    })

    const commitProfile = useCallback(
        async (data: Omit<TablesInsert<'profiles'>, 'user_id'>) => {
            const response = await fetch(
                '/api/commit-profile',
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            )
            .then(res => res.json());

            return response;
        },
        []
    )

    async function onSubmit(values: z.infer<typeof FormSchema>) {
        commitProfile({
            ...values,
            DOB: values.DOB.toISOString(),
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <div className='grid grid-cols-4 items-center justify-items-center'>
                    <div className="text-lg font-medium text-slate-800 mb-2">
                        {userName || 'Name'}
                    </div>
                    <div className="flex items-center gap-2">
                        <LuMapPin size={16} className='text-blue-800'/>
                        <div className="text-slate-800">Los Angeles, CA</div>
                    </div>
                    <div className="flex align-center gap-2">
                        <FormField  
                            control={form.control}
                            name="DOB"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <DOBPicker value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {isEdit ? (
                    <Button type="submit" onClick={() => console.log(form.formState.errors)}>
                        <LuSave
                            className="mr-2"
                        />
                        Save
                    </Button>
                    ) : (
                    <Button type="button" onClick={() => setIsEdit(true)}>
                        <LuPencil 
                            className="mr-2"
                        />
                        Edit Profile
                    </Button>
                    )}
                </div>
                <div>
                    <h4 className="mb-6">Finances</h4>
                    <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16">
                        <div className="w-full text-left text-lg text-slate-800">Employment type</div>
                        <FormField
                            control={form.control}
                            name="employment"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                            What proportion of your monthly income do you usually invest?
                        </div>
                        <FormField
                            control={form.control}
                            name="salary"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                            What proportion of your net worth does your portfolio make up?
                        </div>
                        <FormField
                            control={form.control}
                            name="assets"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                            render={({field}) => (
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
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
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
                    <h4 className="mb-6">Experience</h4>
                    <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16">
                        <div className="text-lg text-slate-800">
                            How many years&#x27; experience do you have investing in stocks?
                        </div>
                        <FormField 
                            control={form.control}
                            name="risk_tolerance_q1"
                            render={({field}) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
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
                    <h4 className="mb-6">Risk Tolerance</h4>
                    <Card className="grid grid-cols-1 items-center justify-items-stretch gap-12 p-16">
                        <div className="text-lg text-slate-800">
                            Which of the following best describes your association with
                            financial risk?
                        </div>
                        <FormField 
                            control={form.control}
                            name="risk_tolerance_q1"
                            render={({field}) => (
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
                                                <FormLabel className="font-normal">Danger</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Uncertainty</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Indifference</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="4" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Opportunity</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="5" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Thrill</FormLabel>
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
                            render={({field}) => (
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
                                                <FormLabel className="font-normal">Very low</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Low</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Average</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="4" />
                                                </FormControl>
                                                <FormLabel className="font-normal">High</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="5" />
                                                </FormControl>
                                                <FormLabel className="font-normal">Very high</FormLabel>
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
                            render={({field}) => (
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
                                                <FormLabel className="font-normal">4% to 5%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <FormLabel className="font-normal">2% to 6%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <FormLabel className="font-normal">0% to 7%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="4" />
                                                </FormControl>
                                                <FormLabel className="font-normal">-2% to 10%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="5" />
                                                </FormControl>
                                                <FormLabel className="font-normal">-5% to 20%</FormLabel>
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
                            render={({field}) => (
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
                                                <FormLabel className="font-normal">&lt;10%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="2" />
                                                </FormControl>
                                                <FormLabel className="font-normal">10%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="3" />
                                                </FormControl>
                                                <FormLabel className="font-normal">20%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="4" />
                                                </FormControl>
                                                <FormLabel className="font-normal">30%</FormLabel>
                                            </FormItem>
                                            <FormItem  className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem value="5" />
                                                </FormControl>
                                                <FormLabel className="font-normal">&gt;50%</FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </Card>
                </div>
                <div>
                    <h4 className="mb-6">Preferences</h4>
                    <Card className="flex flex-col gap-12 items-center p-16">
                        <div className="flex flex-col gap-12 items-center">
                        <div className="text-lg text-slate-800">
                            What proportion of your portfolio do you wish to invest in
                            international stocks?
                        </div>
                        <FormField 
                            control={form.control}
                            name="international"
                            render={({field}) => (
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
                            What proportion of your portfolio do you wish to invest in ETFs?
                        </div>
                        <FormField 
                                control={form.control}
                                name="passive"
                                render={({field}) => (
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
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <IndustryPreferences handleChange={field.onChange} value={field.value} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </Card>
                </div>
            </form>
        </Form>
    )
}