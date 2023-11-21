import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import AllAdviceTable from './components/all-advice-table';

export default async function ({ params }) {
    const supabase = createServerComponentClient({ cookies });

    const portfolioID = params["portfolioID"];

    if (!portfolioID) {
      // TO DO: redirect to 404
    }

    const {
        data: { session },
      } = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from("advice")
    .select("*")
    .eq("portfolio_id", portfolioID)
    .order('created_at', { ascending: false });

    return (
      <>
        <div className="mb-6">
          <div className="flex flex-col">
              <h1 className="">Statements</h1>
              <div className="text-lg">
                View your Statements of Advice
              </div>
          </div>
        </div>
        <AllAdviceTable adviceData={data}/>
      </>
    );
}
