import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import Link from "next/link";
import Image from "next/image";

import { NewUserForm } from './components/new-user-tabs';
import Footer from 'src/app/footer';

import type { Database } from '@/types/supabase';

export default async function NewUserPage() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <>
            <div className="grid grid-cols-1 content-between justify-stretch mb-12">
                <div className="flex items-center justify-center py-8">
                    <Link
                        href="/"
                        className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
                    >
                        <Image
                            src="/everest-logo-transparent-background.png"
                            alt="Everest Logo"
                            width={48}
                            height={48}
                        />
                    </Link>
                </div>
                <div className="h-full flex flex-col justify-center justify-items-center items-center px-12">
                    <h1 className='text-lg font-medium mb-4'>Welcome {user?.user_metadata['name'] || 'Name'}</h1>
                    <NewUserForm />
                </div>
            </div>
            <Footer />
        </>
    );
}
