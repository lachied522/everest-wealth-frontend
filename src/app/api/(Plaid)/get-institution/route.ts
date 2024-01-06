import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { plaidClient } from "@/lib/plaid-client";

import type { Database } from '@/types/supabase';
import type { CountryCode } from 'plaid';

export async function GET(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // redirect to login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    const { searchParams } = new URL(req.url);
    const portfolio_id = searchParams.get('for');
    
    if (!portfolio_id) return NextResponse.json({}, { status: 400 });

    try {
        // fetch access token from DB
        const { data, error } = await supabase
        .from('portfolios')
        .select('item_access_token')
        .eq('id', portfolio_id);

        if (error) throw new Error(`Error fetching record: ${error}`);
        
        const token = data[0].item_access_token;

        if (!token) throw new Error(`Access token does not exist.`);

        // retrieve item from Plaid
        const itemResponse = await plaidClient.itemGet({
            access_token: token,
        });

        const institutionID = itemResponse.data.item.institution_id;

        if (!institutionID) throw new Error(`No institution.`);

        const instResponse = await plaidClient.institutionsGetById({
            institution_id: institutionID,
            country_codes: ['US' as CountryCode],
            options: {
                include_optional_metadata: true,
            }
        });

        return NextResponse.json(instResponse.data.institution);

    } catch (e) {
        console.log(e);
        return NextResponse.json({}, { status: 500 });
    }
}