import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import ProfilePage from "./components/profile-page";

export default async function () {

  const supabase = createServerComponentClient({ cookies });

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
    <ProfilePage profileData={data[0]}/>
  );
};