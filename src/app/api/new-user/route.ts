import { createRouteHandlerClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { NextResponse } from 'next/server';

import type { Database, Tables } from '@/types/supabase';

async function createProfile({ profile, session, supabase } : {
    profile: Partial<Tables<'profiles'>>
    session: Session
    supabase: SupabaseClient
}) {

    const { data, error } = await supabase
        .from('profiles')
        .insert({
            ...profile,
            user_id: session.user.id
        })
        .select();

    if (error) console.log(`Error creating profile: ${error}`);
}

async function newAdvice({ amount, portfolio, session } : {
    portfolio: Tables<'portfolios'>
    amount: number,
    session: Session
}) {
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL}/new_advice/${session.user.id}`;

    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            amount,
            portfolio_id: portfolio.id,
            reason: "new",
        }),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    });
}

type RequestBody = {
    profile: Partial<Tables<'profiles'>>
    portfolio: {
        name: string
        objective: string
        value: number
        flatBrokerage?: number
    }
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
        
    // create user profile
    createProfile({
        profile: body.profile,
        session,
        supabase,
    })

    // create portfolio record
    const { data, error } = await supabase
    .from('portfolios')
    .insert({
        ...body.portfolio,
        user_id: session.user.id
    })
    .select();

    if (error) throw new Error(`Error creating portfolio ${error}`);

    newAdvice({
        portfolio: data[0],
        amount: body.portfolio.value,
        session,
    });

    // redirect user to new portfolio
    return NextResponse.redirect(new URL(`/portfolio/${data[0].id}`, req.url));

    } catch (e) {
        console.log(e);

        return Response.error();
    }

}