import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { plaidClient } from "@/lib/plaid-client";

export async function POST(req) {
    // exchanges client's public token for access token and stores in DB
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const body = await req.json();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    try {
        const exchangeResponse = await plaidClient.itemPublicTokenExchange({
            public_token: body.public_token,
        });

        // store in DB
        const { error } = await supabase
            .from('portfolios')
            .update({ item_access_token: exchangeResponse.data.access_token })
            .eq('id', body.portfolio_id);

        if (error) throw new Error(`Error updating DB: ${error}`);

        return Response.json({ ok: true });

    } catch (e) {
        console.log(e);
        return Response.json({ ok: false });
    }

}