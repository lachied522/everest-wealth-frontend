"use client";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req) {
    const supabase = createRouteHandlerClient({ cookies })
  
    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()
  
    if (session) {
      await supabase.auth.signOut()
    }
  
    return NextResponse.redirect(new URL('/', req.url), {
      status: 302,
    })
  }