import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL;

async function newPortfolio({ data, session }) {
    const url = `${WEB_SERVER_BASE_URL}/new_portfolio/${session.user.id}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ 
                name: data.name, 
                existing: Boolean(data.existing),
                value: Number(data.value),
                objective: data.objective,
            }),
            headers: {
                "Content-Type": "application/json",
                token: session.access_token,
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            return { success: true, data: responseData };
        } else {
            throw new Error("Server error");
        }

    } catch (err) {
        console.log(err);
        return { success: false, msg: "An error occurred while making the request." }
    }
}

export async function POST(req) {
    const supabase = createRouteHandlerClient({ cookies });

    const {
        data: { session },
      } = await supabase.auth.getSession();

    const body = await req.json();

    const res = await newPortfolio({
        data: body,
        session,
    });

    if (res.success) {
        const url = new URL(`/portfolio/?p=${res.data.id}`, req.url);
        
        return new Response(JSON.stringify({ url: url }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
    } else {
        return new Response(JSON.stringify({ error: res.msg }), {
            status: 500,
            headers: {
              "Content-Type": "application/json"
            }
          });
    }
}