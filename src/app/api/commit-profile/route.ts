import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { Database, TablesInsert } from '@/types/supabase';

type Data = TablesInsert<'profiles'>

type RequestBody = {
  data: Data
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
        .from('profiles')
        .insert({
            ...body.data,
            user_id: session.user.id,
        })
        .select()

        if (error) {
            console.log(error);
            throw new Error(`Error committing data: ${error}`);
        }


        return Response.json({
          success: true,
        });

    } catch (e) {

      console.log(e);

      return Response.json({
        success: false,
      });
    }
}