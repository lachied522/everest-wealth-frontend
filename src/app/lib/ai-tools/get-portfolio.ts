import { cookies } from "next/headers";
import { createRouteHandlerClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { ChatCompletionTool } from "openai/resources";
import type { Database } from "@/types/supabase";
import { PortfolioIDUndefinedError } from "./custom-errors";

export const getPortfolioToolSchema: ChatCompletionTool = {
    type: "function",
    function: {
        name: "getPortfolio",
        description: "Get information about the user's portfolio and their current investments'",
        parameters: {
            type: "object",
            properties: {}, // the parameter 'portfolio_id' is added programmatically
            required: [],
        }
    }
}

async function fetchData(supabase: SupabaseClient<Database>, portfolioID: string) {
    const { data, error } = await supabase
    .from("portfolios")
    .select("name, objective, holdings(symbol, units, cost)")
    .eq("id", portfolioID);

    console.log(error);

    if (error) throw new Error(`Error fetching portfolio in AI call: ${error}`);

    return data[0];
}

type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

function formatResults(result: ResolvedPromise<ReturnType<typeof fetchData>>) {
    // format results for interpretation by AI
    return result;
}

// it is necessary to define return type as any since the recursiveAICall doesn't know which function it is calling
export async function getPortfolio(portfolioID?: string, ...args: any[]): Promise<any> {
    if (!portfolioID) {
        throw new PortfolioIDUndefinedError();
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    try {
        const results = await fetchData(supabase, portfolioID);

        console.log(results);

        return formatResults(results);
    } catch (e) {
        console.log(e);

        return "There was an error calling the function";
    }
}