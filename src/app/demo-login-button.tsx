"use client";
import { useRouter } from "next/navigation";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Button } from "@/components/ui/button";


export default function DemoLoginButton() {
    const supabase = createClientComponentClient();
    const router = useRouter();


    const onClick = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: String("demo@demo.com"),
                password: String("pocketadviser")
            });
            
            if (error) throw new Error(`Error signing in: ${error}`);
    
            router.push('/dashboard');
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Button onClick={onClick}>
            Access Demo
        </Button>
    )
}