import { createRouteHandlerClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';

import type { Database, TablesInsert } from '@/types/supabase';

async function createProfile({ profile, session, supabase } : {
    profile: Omit<TablesInsert<'profiles'>, 'user_id'>
    session: Session
    supabase: SupabaseClient<Database>
}) {

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            ...profile,
            user_id: session.user.id
        })
        .select();

    console.log(error);

    if (error) console.log(`Error creating profile: ${error}`);
}

async function createPortfolio({ portfolio, session, supabase } : {
    portfolio: Omit<TablesInsert<'portfolios'>, 'user_id'> & {
        holdings: TablesInsert<'holdings'>[]
    }
    session: Session
    supabase: SupabaseClient<Database>
}) {
    const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .insert({
            name: portfolio.name,
            objective: portfolio.objective,
            international: portfolio.international,
            active: portfolio.active,
            entity: portfolio.entity,
            preferences: portfolio.preferences,
            user_id: session.user.id,
        })
        .select();

    console.log(portfolioError);

    if (portfolioError) throw new Error(`Error creating portfolio ${portfolioError}`);

    const portfolio_id = portfolioData[0].id;

    if (portfolio.holdings.length > 0) {
        const { error: holdingsError } = await supabase
        .from('holdings')
        .upsert(portfolio.holdings.map((holding) => ({
            ...holding,
            portfolio_id,
        })));
    
        if (holdingsError) throw new Error(`Error inserting holdings ${holdingsError}`);
    }
    
    return portfolio_id;
}

async function newAdvice({ portfolio_id, amount, session } : {
    portfolio_id: string,
    amount?: number,
    session: Session
}) {
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL}/new_advice/${portfolio_id}`;

    console.log(amount);

    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            amount: amount || 0,
            reason: "new",
        }),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    });
}

type RequestBody = {
    profile: Omit<TablesInsert<'profiles'>, 'user_id'>
    portfolio: Omit<TablesInsert<'portfolios'>, 'user_id'> & {
        holdings: TablesInsert<'holdings'>[]
        value?: number
    }
}

export async function POST(req: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return NextResponse.json("User not logged in", { status: 500 });

    const body = await req.json() as RequestBody;

    try {
            
        // Step 1: create profile record
        await createProfile({
            profile: body.profile,
            session,
            supabase,
        })

        // Step 2: create portfolio record
        const portfolio_id = await createPortfolio({
            portfolio: body.portfolio,
            session,
            supabase,
        })

        // Step 3: create portfolio record - does not need to be awaited
        newAdvice({
            portfolio_id,
            amount: body.portfolio.value,
            session,
        });

        // redirect user to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));

    } catch (e) {
        console.log(e);

        return NextResponse.json({}, { status: 500 });
    }

}