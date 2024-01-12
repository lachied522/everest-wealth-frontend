import { cookies } from "next/headers";
import { createRouteHandlerClient, Session, SupabaseClient } from "@supabase/auth-helpers-nextjs";

import type { ChatCompletionTool } from "openai/resources";
import type { Database } from "@/types/supabase";

export const getProfileToolSchema: ChatCompletionTool = {
    type: "function",
    function: {
        name: "getProfile",
        description: "Get user's basic financial information. This can help you form advice that is appropriate to the user.",
        parameters: {
            type: "object",
            properties: {}, // the parameter 'user_id' is added programmatically
            required: [],
        }
    }
}

async function fetchProfile(supabase: SupabaseClient<Database>, session: Session) {
    const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .order('created_at', { ascending: false})
    .limit(1);

    if (error) throw new Error(`Error fetching profile in AI call: ${error}`);

    return data[0];
}

type ResolvedPromise<T> = T extends Promise<infer R> ? R: never;

function formatResults(result: ResolvedPromise<ReturnType<typeof fetchProfile>>) {
    // format results for interpretation by AI
    return {
        ...result,
    };
}

export async function getProfile(...args: any[]): Promise<any> {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return; // this should never happen

    try {
        const results = await fetchProfile(supabase, session);

        console.log(results);

        return formatResults(results);
    } catch (e) {
        console.log(e);

        return "There was an error calling the function";
    }
}