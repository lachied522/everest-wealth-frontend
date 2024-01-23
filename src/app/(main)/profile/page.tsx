import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';

import ProfileForm from "./components/profile-form";

import type { Database } from '@/types/supabase';

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
      data: { session },
    } = await supabase.auth.getSession();

  if (!session) {
    // layout in (main) should prevent this
    redirect('/login');
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .order('created_at', { ascending: false})
    .limit(1);

  if (error) {
    console.log(error);
    return;
  }
  
  return (
    <>
      <div className='flex flex-col justify-end min-h-[274px] rounded relative overflow-hidden p-6 mb-6'>
        <Image
          src="/profile-banner-image.jpeg"
          loading="eager"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 96vw, (max-width: 1439px) 79vw, 1044px"
          alt='Cover Image'
          fill
          className='z-[-1] h-full object-cover absolute inset-0'
        />
        <div className='z-[-1] opacity-60 bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.84))] absolute top-[24%] bottom-0 inset-x-0' />
      </div>
      <div className='flex flex-col justify-center gap-4 mb-4'>
        <h2 className="text-2xl font-medium">Your Profile</h2>
        <p className='text-lg text-slate-800'>Your profile helps us make recommendations that are appropriate for you. It is important to make sure your profile is update to date.</p>
      </div>
      <ProfileForm data={data[0]} metaData={session.user.user_metadata} />
    </>
  );
};