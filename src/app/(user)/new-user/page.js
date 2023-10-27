import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';


import { NewPortfolioForm } from './components/new-portfolio-form';

export default async function NewUserPage() {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return (
        <div className="h-[100vh] grid grid-cols-1 content-between justify-stretch">
            <div className="flex items-center justify-center py-8">
                    <Link
                        href="/"
                        className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
                    >
                    <Image
                        src="/palladian.svg"
                        alt="Palladian Logo"
                        width={48}
                        height={48}
                    />
                    </Link>
            </div>
            <div className="h-full flex flex-col justify-center justify-items-center items-center px-12">
                <Card className='p-12 xl:max-w-[60vw] lg:p-16'>
                    <div className='flex flex-col gap-1 text-center mb-8'>
                        <h1>Welcome {session?.user.user_metadata['name'] || 'Name'}</h1>
                        <div className='text-lg text-slate-800'>Create your first portfolio</div>
                    </div>
                    <Separator className='my-16'/>
                    <NewPortfolioForm session={session} />
                </Card>
            </div>
            <div
                className="dashboard-footer-wrapper"
            >
                <div className="container-default w-container">
                <div className="dashboard-footer-inner-wrapper">
                    <div>
                    Copyright © Dashly X | Designed by
                    <a href="https://brixtemplates.com/">BRIX Templates</a> - Powered
                    by <a href="https://webflow.com/">Webflow</a>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}
