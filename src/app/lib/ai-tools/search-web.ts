import type { ChatCompletionTool } from "openai/resources";

export const webSearchToolSchema: ChatCompletionTool = {
    type: "function",
    function: {
        name: "searchWeb",
        description: "Search the internet for up to date information. Use this to find information stock market news and information.",
        parameters: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The phrase that will be used to search the internet"
                }
            },
            required: ["query"],
        }
    }
}

type Results = {
    title: string
    url: string
    content: string
}

function formatResults(results: Results[]) {
    return results.map((result) => ({
        source: result.url,
        content: result.content,
    }))
}

export async function searchWeb(query?: string, ...args: any[]): Promise<any> {
    // use Tavily API to search web, for use in gen AI responses
    if (!query) return;

    const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query,
            search_depth: "basic",
            include_answer: false,
            max_results: 3,
        })
    })
    .then((res) => res.json());

    console.log(formatResults(response.results));

    return formatResults(response.results);
}