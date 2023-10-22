import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


function updatePortfolio(currentPortfolio, transactions) {
    const newPortfolio = [...currentPortfolio]; //create copy of current portfolio
    const symbols = Array.from(newPortfolio, (obj) => { return obj.symbol });
    for (const { symbol, units, last_price } of transactions) {
      if (units===0) continue; //prevent zero unit holdings
      const index = symbols.indexOf(symbol);
      if (index > -1) {
        //existing holding
        const holding = newPortfolio[index];
        newPortfolio[index] = {
          ...holding,
          symbol: symbol,
          units: Math.max(holding.units+units,0),
          cost: last_price,
        }
      } else {
        newPortfolio.push({
          symbol: symbol,
          units: units,
          cost: last_price,
          locked: false,
        })
      }
    };

    return newPortfolio;
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

    
    // get portfolio
    const { data: portfolio, error: portfolioError } = await supabase
    .from("portfolios")
    .select("data")
    .eq("id", body.portfolio_id);

    if (portfolioError) console.log(portfolioError); //should change status of api response

    const newPortfolio = updatePortfolio(
        portfolio[0].data || [],
        body.transactions
    );

    //update portfolio data and set advice to 'actioned'
    const { data, error: commitError } = await supabase
    .from('portfolios')
    .update({ data: newPortfolio })
    .eq('id', body.portfolio_id)
    .select();

    if (!commitError) {
        await supabase
        .from('advice')
        .update({ actioned: true })
        .eq('id', body.id)
        .select();
    } else {
        //pass
    }

    // these transactions could be done simultaneously as the following
    // const commitPortfolio = supabase
    // .from('portfolios')
    // .update({ data: newPortfolio })
    // .eq('id', body.portfolio_id);

    // const updateAdvice = supabase
    // .from('advice')
    // .update({ actioned: true })
    // .eq('id', body.id);

    // const { error } = await supabase
    // .transaction([
    //     commitPortfolio,
    //     updateAdvice, 
    // ])
    // .then(() => console.log('Transaction completed successfully'))
    // .catch(error => console.error('Transaction failed:', error));


    return Response.json(data);
    //return NextResponse.redirect(new URL(`/portfolio/${res.id}`, req.url));
}