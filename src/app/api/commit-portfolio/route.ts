import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchStockDataFromServer } from '@/lib/redis-utils';

import type { Database, Tables } from '@/types/supabase';

type NewHolding = Omit<Tables<'holdings'>, 'id'|'created_at'|'portfolio_id'>

function getNewRecords({ currentHoldings, newHoldings } : {
 currentHoldings: Tables<'holdings'>[] | null
 newHoldings: NewHolding[]
}) {
    if (!currentHoldings) return newHoldings;
    return newHoldings.map(
      (newHolding) => {
        const currentHolding = currentHoldings.find((obj) => obj.symbol === newHolding.symbol);

        return {
          id: currentHolding? currentHolding.id: undefined,
          symbol: newHolding.symbol,
          units: Math.max(newHolding.units, 0),
          cost: newHolding.cost || 0,
          locked: currentHolding? currentHolding.locked: false,
        }
      }
    );
}

type Transaction = Omit<Tables<'transactions'>, 'id'|'brokerage'|'date'|'portfolio_id'>

function getTransactions({ currentHoldings, newHoldings } : {
  currentHoldings: Tables<'holdings'>[] | null
  newHoldings: NewHolding[]
 }): Transaction[] {
  if (!currentHoldings) {
    return newHoldings.map(
      (newHolding) => ({
        symbol: newHolding.symbol,
        units: newHolding.units,
        price: newHolding.cost || 0,
        reason: 'adjustment',
      })
    )
  }

  return newHoldings.map(
    (newHolding) => {
      const currentHolding = currentHoldings.find((obj) => obj.symbol === newHolding.symbol);

      if (!currentHolding) {
        return {
          symbol: newHolding.symbol,
          units: newHolding.units,
          price: newHolding.cost || 0,
          reason: 'adjustment',
        }
      }

      return {
        symbol: newHolding.symbol,
        units: newHolding.units - currentHolding.units,
        price: newHolding.cost || 0, // TO DO: make this last_price instead of new holding cost
        reason: 'adjustment',
      }
    }
  ).filter((transaction) => Math.abs(transaction.units) > 0);
}

type RequestBody = {
  data: NewHolding[]
  portfolio_id: string
}

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const body = await req.json() as RequestBody;

    try {
        // get all holdings matching symbols
        const symbols = Array.from(body.data, (obj) => obj.symbol);

        const { data: currentHoldings, error: fetchError } = await supabase
        .from("holdings")
        .select("*")
        .eq("portfolio_id", body.portfolio_id)
        .in("symbol", symbols);

        if (fetchError) throw new Error(`Error fetching data: ${fetchError}`); // should change status of api response

        const newRecords = getNewRecords({
            currentHoldings,
            newHoldings: body.data,
        }).map(holding => ({
            // add portfolio_id column
            ...holding,
            portfolio_id: body.portfolio_id,
        }));

        const { data, error: commitError } = await supabase
          .from('holdings')
          .upsert(newRecords, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
          .select();

        if (commitError) throw new Error(`Error committing changes: ${commitError}`);

        // add transaction to transactions table
        const transactionRecords = getTransactions({ 
          currentHoldings, 
          newHoldings: body.data,
        }).map(transaction => ({
          // add portfolio_id column
          ...transaction,
          portfolio_id: body.portfolio_id,
        }));

        const { error: transactionsError } = await supabase
          .from('transactions')
          .insert(transactionRecords);

        if (transactionsError) console.log(transactionsError);

        // populate new holdings with stock data prior to returning to client
        const populatedHoldings = await fetchStockDataFromServer(data);

        return NextResponse.json({ data: populatedHoldings }, { status: 200 });

    } catch (e) {

      console.log(e);

      return NextResponse.json({ data: [] }, { status: 500 });
    }
}