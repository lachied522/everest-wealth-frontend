import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function getNewHoldings(currentHoldings, transactions) {
    const newHoldings = [...currentHoldings]; // create copy of current portfolio
    const symbols = Array.from(newHoldings, (obj) => { return obj.symbol });
    
    for (const { symbol, units, price } of transactions) {
      const index = symbols.indexOf(symbol);
      if (index > -1) {
        // existing holding
        const holding = newHoldings[index];
        const newUnits = Math.max(holding.units + units, 0);

        newHoldings[index] = {
          ...holding,
          symbol: symbol,
          units: newUnits, // zero unit holdings are removed automatically by DB
          cost: price,
        }
      } else {
        newHoldings.push({
          symbol: symbol,
          units: units,
          cost: price,
          locked: false,
        })
      }
    };

    return newHoldings;
}

export async function POST(req) {
    const body = await req.json();

    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }

    let updatedHoldings = [];

    try {
      if (!['confirm', 'dismiss'].includes(body.action)) throw new Error("action must be 'confirm' or 'dismiss'");

      if (body.action==='confirm') {
        // get all holdings matching symbols
        const symbols = Array.from(body.advice.transactions, (obj) => { return obj.symbol });
  
        const { data: holdings, error: holdingsError } = await supabase
        .from("holdings")
        .select("*")
        .eq("portfolio_id", body.advice.portfolio_id)
        .in("symbol", symbols);
  
        if (holdingsError) console.log(holdingsError); //should change status of api response
  
        const newHoldingRecords = getNewHoldings(
            holdings,
            body.advice.transactions
        ).map(holding => ({
            ...holding,
            portfolio_id: body.advice.portfolio_id,
        }));
  
        const { data, error: commitError } = await supabase
          .from('holdings')
          .upsert(newHoldingRecords)
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
      
    } catch (e) {

      console.log(e);

      return Response.json({
        updatedHoldings,
        success: false,
      });
    }

    return Response.json({
      updatedHoldings,
      success: true,
    });
}