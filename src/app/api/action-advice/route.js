import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchStockDataFromServer } from '@/lib/redis-utils';

function getNewHoldings({ currentHoldings, transactions }) {
    return transactions.map(
      (transaction) => {
        const holding = currentHoldings.find((obj) => obj.symbol === transaction.symbol);

        return {
          id: holding? holding.id: undefined,
          symbol: transaction.symbol,
          units: holding? Math.max(holding.units + transaction.units, 0): transaction.units,
          cost: holding? holding.cost + transaction.price: transaction.price,
          locked: holding? holding.locked: false,
        }
      }
    );
}

export async function POST(req) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const body = await req.json();

    let updatedHoldings = [];

    try {
      if (!['confirm', 'dismiss'].includes(body.action)) throw new Error("action must be 'confirm' or 'dismiss'");

      if (body.action==='confirm') {
        // get all holdings matching symbols
        const symbols = Array.from(body.advice.transactions, (obj) => obj.symbol);
  
        const { data: currentHoldings, error: holdingsError } = await supabase
        .from("holdings")
        .select("*")
        .eq("portfolio_id", body.advice.portfolio_id)
        .in("symbol", symbols);
  
        if (holdingsError) console.log(holdingsError); //should change status of api response
  
        const newHoldingRecords = getNewHoldings({
            currentHoldings,
            transactions: body.advice.transactions,
        }).map(holding => ({
            ...holding,
            portfolio_id: body.advice.portfolio_id,
        }));
  
        const { data, error: commitError } = await supabase
          .from('holdings')
          .upsert(newHoldingRecords, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
          .select();
        
        if (commitError) throw new Error(`Error committing changes: ${commitError}`);

        updatedHoldings = data;
      }

      // update status of advice record
      const status = body.action==='confirm'? 'actioned': 'dismissed';
      const { error } = await supabase
        .from('advice')
        .update({ status })
        .eq('id', body.advice.id)
        .select();

      // populate new holdings with stock data prior to returning to client
      const populatedHoldings = await fetchStockDataFromServer(updatedHoldings);
    
      return Response.json({
        data: populatedHoldings,
        success: true,
      });

    } catch (e) {

      console.log(e);

      return Response.json({
        data: [],
        success: false,
      });
    }
}