import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { fetchSymbol } from 'src/app/lib/redis';

import AllAdviceTable from './components/all-advice-table';

async function addInfoToTransactions(transactions) {
  if (!(transactions.length > 0)) return [];

  const newArray = await Promise.all(transactions.map(async ({ symbol, units, brokerage, price }) => {
      const data = await fetchSymbol(symbol);

      if (!data) return { symbol, units, brokerage, price };

      const value = (price * units).toFixed(2);
      const net = brokerage? (price * units - brokerage).toFixed(2): value;

      const transaction = units > 0? "Buy" : "Sell";

      const name = data['name'];

      return { symbol, units, brokerage, price, name, transaction, value, net};
  }));

  return newArray;
}

export default async function Page({ params }) {
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

    // populate advice data
    const populatedData = await Promise.all(data.map(async (advice) => {
      const transactions = await addInfoToTransactions(advice.transactions);

      const value = transactions.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
      const gross = transactions.reduce((acc, obj) => acc + parseFloat(obj.units) * obj.price, 0);
      const brokerage = transactions.reduce((acc, obj) => acc + parseFloat(obj.brokerage), 0);

      return {
        ...advice,
        transactions,
        value,
        gross,
        brokerage
      }
    }));
    
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
