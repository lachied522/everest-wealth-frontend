import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import Link from "next/link";
import Image from "next/image";

import { Database } from '@/types/supabase';

import { NewUserForm } from './components/new-user-form';

export default async function NewUserPage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

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
                <h1 className='mb-4'>Welcome {session?.user.user_metadata['name'] || 'Name'}</h1>
                <NewUserForm />
            </div>
            <div className="dashboard-footer-wrapper">
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
