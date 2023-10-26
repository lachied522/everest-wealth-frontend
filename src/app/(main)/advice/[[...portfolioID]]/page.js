import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import AllAdviceTable from './components/all-advice-table';

export default async function ({ params }) {
    const supabase = createServerComponentClient({ cookies });

    const {
        data: { session },
      } = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from("advice")
    .select("*")
    .eq("user_id", session.user.id)
    .order('created_at', { ascending: false });

    return (
        <div className="md:max-w-screen-lg px-6 mx-auto">
        <div className="mb-6">
          <div className="flex flex-col">
              <h1 className="">Statements</h1>
              <div className="text-lg">
                View your Statements of Advice
              </div>
          </div>
        </div>
        <AllAdviceTable adviceData={data}/>
      </div>
    );
}
