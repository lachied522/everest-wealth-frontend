import { cookies } from "next/headers";
import { createRouteHandlerClient, Session } from "@supabase/auth-helpers-nextjs";

import type { ChatCompletionTool } from "openai/resources";
import type { Database } from "@/types/supabase";
import { PortfolioIDUndefinedError } from "./custom-errors";

export const getSingleAdviceToolSchema: ChatCompletionTool = {
    type: "function",
    function: {
        name: "getSingleAdvice",
        description: "Get information on whether the user should invest in a stock based on their current portfolio and investment profile",
        parameters: {
            type: "object",
            properties: {
                symbol: {
                    type: "string",
                    description: "The ticker symbol of the stock, e.g. BHP or AAPL."
                },
                amount: {
                    type: "number",
                    description: "The proposed amount to be invested in dollars. Must be non-zero."
                }
            },
            required: ["symbol", "amount"], // the parameter 'portfolio_id' is added programmatically
        }
    }
}

async function fetchData(symbol: string, amount: number, portfolioID: string, session: Session) {
    const url = `${process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL}/get_single_advice/${portfolioID}`;

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            amount,
            symbol,
        }),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    })
    .then((res) => {
        if (!res.ok) throw new Error(`Error calling function.`)
        return res.json();
    });

    console.log(response);

    return response;
}

type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

function formatResults(result: ResolvedPromise<ReturnType<typeof fetchData>>) {
    // format results for interpretation by AI
    return result;
}

// it is necessary to define return type as any since the recursiveAICall doesn't know which function it is calling
export async function getSingleAdvice(symbol: string, amount: number, portfolioID?: string, ...args: any[]): Promise<any> {
    if (!portfolioID) {
        throw new PortfolioIDUndefinedError();
    }

    if (amount===0) {
        return "Ask the user what the amount should be."
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    try {
        const results = await fetchData(symbol, amount, portfolioID, session!);

        console.log(results);

        return formatResults(results);
    } catch (e) {
        console.log(e);

        return "There was an error calling the function";
    }
}