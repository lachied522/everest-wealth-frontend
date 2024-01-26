import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database, TablesUpdate } from '@/types/supabase';

type RequestBody = {
  data: TablesUpdate<'portfolios'>
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
        const { data, error } = await supabase
        .from("portfolios")
        .update({ ...body.data })
        .eq("id", body.portfolio_id)
        .select();

        if (error) {
            console.log(error);
            throw new Error(`Error committing data: ${error}`);
        }

        return NextResponse.json({}, { status: 200 });

    } catch (e) {

      console.log(e);

      return Response.json({}, { status: 500 });
    }
}