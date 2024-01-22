import { createRouteHandlerClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchStockDataFromServer } from '@/lib/redis-utils';

import type { Database, Tables } from '@/types/supabase';
import type { AdviceData, Transaction } from '@/types/types';

function getNewHoldings({ currentHoldings, transactions } : { 
  currentHoldings: Tables<'holdings'>[] | null
  transactions: Transaction[]
}) {
    return transactions.map(
      (transaction) => {
        const holding = currentHoldings?.find((obj) => obj.symbol === transaction.symbol);

        return {
          id: holding? holding.id: undefined,
          symbol: transaction.symbol,
          units: holding? Math.max(holding.units + transaction.units, 0): transaction.units,
          cost: holding? (holding.cost? holding.cost: 0 + transaction.price): transaction.price,
          locked: holding? holding.locked: false,
        } as Tables<'holdings'>
      }
    );
}

async function updateAdviceRecord(
  adviceRecord: Pick<AdviceData, "id"|"portfolio_id"|"recom_transactions">,
  newData: Transaction[],
  supabase: SupabaseClient
) {
  const symbols = Array.from(newData, (obj) => obj.symbol);

  const updatedTransactions = adviceRecord.recom_transactions.map(
    (transaction) => (symbols.includes(transaction.symbol) ? {
      ...transaction,
      status: 'actioned',
    }: transaction)
  );

  const { error } = await supabase
    .from('advice')
    .update({ 
      transactions: updatedTransactions
    })
    .eq('id', adviceRecord.id)
    .select();

  if (error) throw new Error(`Erroring updating advice record: ${error}`);
}

type RequestBody = {
    data: Transaction[]
    advice_id: string
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

    const { data, advice_id } = await req.json() as RequestBody;

    let updatedHoldings: Tables<'holdings'>[] = [];

    try {
      // Step 1: retrieve advice record
      const { data: advice, error: adviceError } = await supabase
      .from("advice")
      .select("id, portfolio_id, recom_transactions(*)")
      .eq("id", advice_id);

      if (!advice || adviceError) throw new Error(`Error fetching advice: ${adviceError}`);

      if (data.length) {
        // Step 2: get all existing holdings matching symbols
        const symbols = Array.from(data, (obj) => obj.symbol);
  
        const { data: currentHoldings, error: holdingsError } = await supabase
        .from("holdings")
        .select("*")
        .eq("portfolio_id", advice[0].portfolio_id!)
        .in("symbol", symbols);
  
        if (holdingsError) throw new Error(`Error fetching holdings: ${holdingsError}`);
  
        const newHoldingRecords = getNewHoldings({
            currentHoldings,
            transactions: data,
        }).map(holding => ({
            ...holding,
            portfolio_id: advice[0].portfolio_id!,
        }));
        
        // Step 3: upsert new holdings to DB
        const { data: updatedHoldings, error: commitError } = await supabase
          .from('holdings')
          .upsert(newHoldingRecords, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
          .select();
        
        if (commitError) throw new Error(`Error committing changes: ${commitError}`);

        // Step 4: add transaction to transactions table
        const { error: transactionsError } = await supabase
          .from('transactions')
          .insert(
            data.map((transaction) => ({
              ...transaction,
              reason: 'advice',
              portfolio_id: advice[0].portfolio_id!,
            })
          ));
      }

      // Step 5: update advice record
      await updateAdviceRecord({
        ...advice[0],
        recom_transactions: advice[0].recom_transactions,
      }, data, supabase);

      // populate new holdings with stock data prior to returning to client
      const populatedHoldings = await fetchStockDataFromServer(updatedHoldings);
    
      return NextResponse.json({ data: populatedHoldings }, { status: 200 });

    } catch (e) {

      console.log(e);

      return NextResponse.json({ data: [] }, { status: 500 });
    }
}