import { createServerComponentClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { Database } from '@/types/supabase';
import { AdviceData, Transaction } from '@/types/types';

import AllAdviceTable from './components/all-advice-table';

function populateTransactionsColumns(transactions: Transaction[]) {
  // populate columns
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
      .select("*")
      .eq("portfolio_id", portfolioID)
      .order('created_at', { ascending: false });

    // populate advice data
    const populatedData = data?.map((advice) => {
      const transactions = populateTransactionsColumns(advice.transactions as Transaction[]);

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
    
    // NOTE: data must be converted to JSON before passing to client
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
        <AllAdviceTable jsonData={JSON.stringify(populatedData)} />
      </>
    );
}
