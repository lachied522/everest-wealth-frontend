import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import AllAdviceTable from './components/all-advice-table';

import type { Database } from '@/types/supabase';


interface PageProps {
  params: {
    portfolioID: string
  }
}

export default async function Page({ params }: PageProps) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

    const portfolioID = params.portfolioID;

    if (!portfolioID) {
      // TO DO: redirect to 404
    }

    const { data, error } = await supabase
      .from("advice")
      .select("*, recom_transactions(*)")
      .eq("portfolio_id", portfolioID)
      .order('created_at', { ascending: false });
    
    return (
      <>
        <div className="text-lg text-slate-700 mb-8">
            View your Statements of Advice
        </div>
        <AllAdviceTable data={data} />
      </>
    );
}
