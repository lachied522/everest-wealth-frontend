"use client";
import { useState } from "react"
import { useRouter } from "next/navigation"

import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { LuCheck } from "react-icons/lu"

import { NewProfileForm, FormSchema as ProfileSchema } from "./new-profile-form"
import { NewPortfolioForm, FormSchema as PortfolioSchema } from "./new-portfolio-form"
import { Tables } from "@/types/supabase";

const TABS = ["Sign up", "Profile", "Create your first portfolio"]

interface FormData {
    profile: Partial<Tables<'profiles'>>
    portfolio: Partial<Tables<'portfolios'>>
}

export const NewUserForm = () => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        profile: {},
        portfolio: {
            objective: ""
        }
    })

    async function onProfileSubmit(values: z.infer<typeof ProfileSchema>) {
        // update state
        setFormData({
            ...formData,
            profile: values,
        })
        // navigate to next tab
        setActiveTab(2)
    }

    async function onPortfolioSubmit(values: z.infer<typeof PortfolioSchema>) {
        setLoading(true);

        fetch("/api/new-user", {
            method: "POST",
            body: JSON.stringify({
                ...formData,
                portfolio: values,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((portfolio) => {
            // navigate to portfolio
            router.push(portfolio.url); 
        })
        .catch((err) => console.log(err));
    }

    return (
        <>
        <div className="grid grid-cols-3">
            {TABS.map((tab, index) => (
            <Button
                key={index}
                variant="ghost"
                disabled={index < 1}
                onClick={() => setActiveTab(index)}
            >
                {activeTab > index && <LuCheck className="text-green-400 mr-2" />}
                {tab}
            </Button>
            ))}
        </div>
        <Separator className="my-8" />
        {activeTab !== 2 && (
            <NewProfileForm onSuccess={onProfileSubmit} />
        )}
        {activeTab === 2 && (
            <NewPortfolioForm onSuccess={onPortfolioSubmit} navigateBack={() => setActiveTab(1)}/>
        )}
        </>
    );
};
