import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL;

async function newPortfolio(data, session) {
    const url = `${WEB_SERVER_BASE_URL}/new_portfolio/${session.user.id}`;
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                token: session.access_token,
            }
        })
        return response.json();
    } catch {
        //pass
    }
}

export async function POST(req) {
    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { session },
      } = await supabase.auth.getSession();

    const body = await req.json();

    const res = await newPortfolio({
        name: body.name,
        value: body.value,
        objective: body.objective,
    }, session);

    return NextResponse.redirect(new URL(`/portfolio/${res.id}`, req.url));
}