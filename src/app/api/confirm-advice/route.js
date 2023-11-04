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
    /* 
     * this endpoint is called when user decides to take up advice 
    */

    const body = await req.json();

    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // redirect to login
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // get all holdings matching symbols
    const symbols = Array.from(body.transactions, (obj) => { return obj.symbol });

    const { data: holdings, error: holdingsError } = await supabase
    .from("holdings")
    .select("*")
    .eq("portfolio_id", body.portfolio_id)
    .in("symbol", symbols);

    if (holdingsError) console.log(holdingsError); //should change status of api response

    const newHoldingRecords = getNewHoldings(
        holdings,
        body.transactions
    ).map(holding => ({
        ...holding,
        portfolio_id: body.portfolio_id,
    }));

    const { data, error: commitError } = await supabase
    .from('holdings')
    .upsert(newHoldingRecords)
    .select();

    if (!commitError) {
      // set advice record to actioned
        await supabase
          .from('advice')
          .update({ actioned: true })
          .eq('id', body.id)
          .select();
    } else {
        //pass
    }

    return Response.json(data);
}