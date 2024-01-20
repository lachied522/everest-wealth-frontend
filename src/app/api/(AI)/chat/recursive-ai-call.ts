import OpenAI from "openai";

import { searchWeb, webSearchToolSchema } from '@/lib/ai-tools/search-web';
import { getProfile, getProfileToolSchema } from "@/lib/ai-tools/get-profile";
import { getPortfolio, getPortfolioToolSchema } from "@/lib/ai-tools/get-portfolio";
import { getSingleAdvice, getSingleAdviceToolSchema } from "@/lib/ai-tools/get-single-advice";
import { getAnalystResearch, getAnalystResearchToolSchema } from "@/lib/ai-tools/get-analyst-research";


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const AVAILABLE_TOOLS = {
    searchWeb,
    getProfile,
    getPortfolio,
    getSingleAdvice,
    getAnalystResearch,
}

const TOOL_SCHEMAS = [
    webSearchToolSchema,
    getProfileToolSchema,
    getPortfolioToolSchema,
    getSingleAdviceToolSchema,
    getAnalystResearchToolSchema,
];

async function callTool(
    functionName: string, 
    functionArgs: {
        [key: string]: any
    },
    portfolioID?: string
) {
    if (!(functionName in AVAILABLE_TOOLS)) return;

    try {
        const functionToCall = AVAILABLE_TOOLS[functionName as keyof typeof AVAILABLE_TOOLS];
        const functionArgsArr = Object.values(functionArgs);

        // parameter portfolio_id is necessary for some functions - add it programatically
        functionArgsArr.push(portfolioID);
    
        const result = await functionToCall.apply(null, functionArgsArr);
        return JSON.stringify(result);
    } catch (e) {
        console.log(`Error calling function ${functionName}: ${e}`)
        return;
    }
}

interface RecursiveAICallProps {
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    model?: string
    userName?: string
    portfolioID?: string // id of portfolio query relates to
}

type RecursiveF = AsyncGenerator<string, void | RecursiveF>;

export default async function* recursiveAICall({
    model,
    messages,
    portfolioID,
}: RecursiveAICallProps): RecursiveF {

    const response = await openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo',
        messages,
        tools: TOOL_SCHEMAS,
        tool_choice: "auto",
        stream: true,
    });

    // initiliase array of tool calls
    const tool_calls: {
        id: string
        name: string,
        arguments: string
    }[] = [];

    for await (const chunk of response) {
        // check if finished
        if (chunk.choices[0].finish_reason) {
            break;
        }
        
        const delta = chunk.choices[0].delta;
        if (delta.content) {
            yield delta.content;
        }

        // https://community.openai.com/t/has-anyone-managed-to-get-a-tool-call-working-when-stream-true/498867/10
        if (delta.tool_calls) {
            // console.log(chunk.choices[0].delta.tool_calls)
            const tool_call = delta.tool_calls[0];
            const index = tool_call.index;
            if (index===tool_calls.length) {
                // new tool call - add to array
                tool_calls.push({ id: '', name: '', arguments: '' });
            }
            if (tool_call.id) tool_calls[index].id = tool_call.id;
            if (tool_call.function) {
                if (tool_call.function.name) tool_calls[index].name = tool_call.function.name;
                if (tool_call.function.arguments) tool_calls[index].arguments += tool_call.function.arguments;
            }
        }
    }

    // check if AI wishes to call tool
    console.log(tool_calls);
    if (tool_calls.length > 0) {
        await Promise.all(tool_calls.map(async (tool_call) => {
            const functionName = tool_call.name;
            const functionArgs = JSON.parse(tool_call.arguments);
            const functionResponse = await callTool(functionName, functionArgs, portfolioID);

            messages.push({
                role: "function",
                name: functionName,
                content: `The result of the function was: ${JSON.stringify(
                      functionResponse
                    )}`,
            });
        }));

        console.log(messages);

        const response = recursiveAICall({
            model,
            messages,
        });
        
        for await (const content of response) {
            yield content;
        }
    }
}