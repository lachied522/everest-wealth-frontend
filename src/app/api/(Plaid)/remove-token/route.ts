import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { plaidClient } from "@/lib/plaid-client";

import type { Database } from '@/types/supabase';

type RequestBody = {
  portfolio_id: string
}

export async function POST(req: Request) {
    // remove plaid link from DB
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const body = await req.json() as RequestBody;

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // fetch access token from DB in order to invalidate it
        const { data, error } = await supabase
        .from('portfolios')
        .select('item_access_token')
        .eq('id', body.portfolio_id);

        if (error) throw new Error(`Error fetching record: ${error}`);
        
        const token = data[0].item_access_token;

        // check if token is already null
        // this should not happen if this route is called
        if (!token) return Response.json({ success: true });

        // make item invalid
        const response = await plaidClient.itemRemove({
            access_token: token,
        });

        // remove from DB
        const { error: commitError } = await supabase
        .from('portfolios')
        .update({ item_access_token: null })
        .eq('id', body.portfolio_id);

        return Response.json({ success: true });

    } catch (e) {
        console.log(e);
        return Response.json({ success: false }, { status: 500 });
    }

}