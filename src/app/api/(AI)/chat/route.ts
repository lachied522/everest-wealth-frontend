import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import OpenAI from "openai";
import { StreamingTextResponse } from "ai";

import type { Database } from '@/types/supabase';
import type { Message } from "ai";

import recursiveAICall from './recursive-ai-call';

export const runtime = 'edge'; // https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

const encoder = new TextEncoder();

function formatMessages({ messages, userName } : {
    messages: Message[],
    userName?: string
}) {
    // add instructions to the current prompt
    const currentPrompt = messages[0].content;
    const formattedMessages = [{
        role: "user", 
        content: `User input: ${currentPrompt}` 
    }].concat(messages.slice(1));

    // add system message to start of messages array
    formattedMessages.unshift({
        role: "system", 
        content: `You are assiting the user${userName? `, ${userName},`: ''} with their financial investments.\
        You can provide factual information and answer any questions they may have, but you cannot give financial advice.\
        \n\nKeep your responses brief.`
    });

    return formattedMessages as OpenAI.ChatCompletionMessageParam[];
}

type RequestBody = {
    messages: Message[]
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

    const { messages, portfolio_id } = await req.json() as RequestBody;

    try {
        // console.log(session.user.user_metadata['name']);
        const formattedMessages = formatMessages({ messages, userName: session.user.user_metadata['name']});

        const response = recursiveAICall({
            model: 'gpt-3.5-turbo',
            messages: formattedMessages,
            portfolioID: "e5c1b50f-2b33-43b0-8855-79e25e8bdad7",
        });

        const stream = new ReadableStream({
            async start(controller) {
                for await (const content of response) {
                    const queue = encoder.encode(content);
                    controller.enqueue(queue);
                }
       
                controller.close();
            }
        });

        return new StreamingTextResponse(stream);
    } catch (e) {
        console.log(`Error ${e}`)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}