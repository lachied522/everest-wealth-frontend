import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import OpenAI from "openai";

import recursiveAICall from './recursive-ai-call';

import type { Database } from '@/types/supabase';

import { Message } from '@/types/ai';

export const runtime = 'edge'; // https://nextjs.org/docs/app/building-your-application/routing/route-handlers#streaming

function formatMessages({ messages, userName } : {
    messages: Message[],
    userName?: string
}) {
    const formattedMessages = messages.map((message) => ({
        ...message,
        content: message.role==='user'? `User input: ${message.content}`: message.content,
    }));

    // add system message to start of messages array
    formattedMessages.unshift({
        role: "system", 
        content: `You are an investment advisor working for Everest Wealth. You are assiting the user${userName? `, ${userName},`: ''} with their investments in the stock market.\n` +
        "Where you cannot answer the user's query, you can recommend the user contact a friendly advisor from Everest Wealth to assist them. Keep your responses brief."
    });

    return formattedMessages as OpenAI.ChatCompletionMessageParam[];
}

type RequestBody = {
    messages: Message[]
    portfolioID: string
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

    const { messages, portfolioID } = await req.json() as RequestBody;

    try {
        // console.log(session.user.user_metadata['name']);
        const formattedMessages = formatMessages({ messages, userName: session.user.user_metadata['name']});

        const response = recursiveAICall({
            model: 'gpt-3.5-turbo',
            messages: formattedMessages,
            portfolioID,
        });

        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();

                for await (const content of response) {
                    const queue = encoder.encode(content);
                    controller.enqueue(queue);
                }
       
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            },
            status: 200
        });
    } catch (e) {
        console.log(`Error ${e}`);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}