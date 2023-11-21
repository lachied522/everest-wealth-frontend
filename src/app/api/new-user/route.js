import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL;


async function createProfile({ data, session, supabase }) {

    const { data: records, error } = await supabase
        .from('profiles')
        .insert({
            ...data,
            user_id: session.user.id
        })
        .select()

    if (error) console.log(error)

    return records[0];
}

async function createNewPortfolio({ name, objective, session, supabase }) {
    const { data: records, error } = await supabase
        .from('portfolios')
        .insert({
            name,
            objective,
            user_id: session.user.id
        })
        .select();

    if (error) console.log(error);

    return records[0];
}


async function newAdvice({ amount, portfolioID, session }) {
    const url = `${WEB_SERVER_BASE_URL}/new_advice/${session.user.id}`;

    const res = fetch(url, {
        method: "POST",
        body: JSON.stringify({
            amount: Number(amount),
            portfolio_id: portfolioID,
            reason: "new",
        }),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    })
    .then(res => res.json())
    .then(data => {
        return { success: true, data };
    })
    .catch(err => {
        console.log(err)
        return { success: false, msg: "An error occurred while making the request." }
    });

    return res;
}

export async function POST(req) {
    const supabase = createRouteHandlerClient({ cookies });

    const body = await req.json();

    const {
        data: { session },
      } = await supabase.auth.getSession();

    if (!session) return new Response(JSON.stringify({ error: "unauthorised "}), {
        status: 401
    });

    // create user profile
    // const profile = await createProfile({
    //     data: body.profile,
    //     session,
    //     supabase,
    // })

    // create portfolio record
    const portfolio = await createNewPortfolio({
        name: body.portfolio.name,
        objective: body.portfolio.objective,
        session,
        supabase,
    })

    const res = await newAdvice({
        amount: body.portfolio.value,
        portfolioID: portfolio.id,
        session,
    });

    if (res.success) {
        // return url of new portfolio
        const url = new URL(`/portfolio/?p=${portfolio.id}`, req.url);
        
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