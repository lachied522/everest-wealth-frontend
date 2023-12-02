import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Image from 'next/image';

import { Separator } from "@/components/ui/separator";

import { LuMapPin, LuCalendar } from "react-icons/lu";

import ProfileForm from "./components/profile-form";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  const {
      data: { session },
    } = await supabase.auth.getSession();

  if (!session) {
    return
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
          src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg"
          loading="eager"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 96vw, (max-width: 1439px) 79vw, 1044px"
          srcSet="
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-500.jpeg   500w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-800.jpeg   800w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1080.jpeg 1080w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1600.jpeg 1600w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-2000.jpeg 2000w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg         2088w
              "
          alt='Cover Image'
          className='z-[-1] h-full object-cover absolute inset-0'
        />
        <div className='z-[-1] opacity-60 bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.84))] absolute top-[24%] bottom-0 inset-x-0' />
      </div>
      <div className='flex flex-col justify-center mb-4'>
        <h2>Your Profile</h2>
        <p className='text-lg text-slate-800'>Your profile helps us make recommendations that are appropriate for you. It is important to make sure your profile is update to date.</p>
      </div>
      <ProfileForm data={data[0]} userName={session.user.user_metadata['name']} />
    </>
  );
};