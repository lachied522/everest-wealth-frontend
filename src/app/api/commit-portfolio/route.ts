import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { fetchStockDataFromServer } from '@/lib/redis-utils';
import { Database, Tables } from '@/types/supabase';

type NewHolding = Omit<Tables<'holdings'>, 'id'|'created_at'|'portfolio_id'>

function getNewHoldings({ currentHoldings, newHoldings } : {
 currentHoldings: Tables<'holdings'>[] | null
 newHoldings: NewHolding[]
}) {
    return newHoldings.map(
      (newHolding) => {
        const currentHolding = currentHoldings?.find((obj) => obj.symbol === newHolding.symbol);

        return {
          id: currentHolding? currentHolding.id: undefined,
          symbol: newHolding.symbol,
          units: Math.max(newHolding.units, 0),
          cost: newHolding.cost? newHolding.cost: 0,
          locked: currentHolding? currentHolding.locked: false,
        }
      }
    );
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

        const newHoldings = getNewHoldings({
            currentHoldings,
            newHoldings: body.data,
        }).map(holding => ({
            // add portfolio_id column
            ...holding,
            portfolio_id: body.portfolio_id,
        }));

        const { data, error: commitError } = await supabase
        .from('holdings')
        .upsert(newHoldings, { onConflict: 'id', ignoreDuplicates: false, defaultToNull: false })
        .select();

        if (commitError) throw new Error(`Error committing changes: ${commitError}`);

        // populate new holdings with stock data prior to returning to client
        const populatedHoldings = await fetchStockDataFromServer(data);

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