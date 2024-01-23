import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import AllAdviceTable from './components/all-advice-table';

import type { Database } from '@/types/supabase';
import type { AdviceData, Transaction } from '@/types/types';

function populateTransactionsColumns(transactions: Transaction[]) {
  if (!(transactions.length > 0)) return [];

  const populatedTransactions = transactions.map((obj) => {
      const price = obj.price || 0;
      const units = obj.units || 0;
      const value = (price * units).toFixed(2);
      const net = obj.brokerage? (price * units - obj.brokerage).toFixed(2): value;

      const transaction = units > 0? "Buy" : "Sell";

      return { ...obj, transaction, value, net};
  });

  return populatedTransactions;
}

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

    // populate advice data
    const populatedData = data?.map((advice) => {
      const transactions = populateTransactionsColumns(advice.recom_transactions as Transaction[]);

      const value = transactions.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
      const gross = transactions.reduce((acc, obj) => acc + obj.units * obj.price, 0);
      const brokerage = transactions.reduce((acc, obj) => acc + obj.brokerage, 0);

      return {
        ...advice,
        transactions,
        value,
        gross,
        brokerage
      }
    });
    
    return (
      <>
        <div className="text-lg text-slate-700 mb-8">
            View your Statements of Advice
        </div>
        <AllAdviceTable data={populatedData} />
      </>
    );
}
