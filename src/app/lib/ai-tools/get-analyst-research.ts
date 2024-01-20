import type { ChatCompletionTool } from "openai/resources";

export const getAnalystResearchToolSchema: ChatCompletionTool = {
    type: "function",
    function: {
        name: "getAnalystResearch",
        description: "Get recent analyst research on a stock, including target price and relevant information. Can help the user form an opinion about a stock.",
        parameters: {
            type: "object",
            properties: {
                symbol: {
                    type: "string",
                    description: "The ticker symbol of the stock, e.g. BHP or AAPL."
                }
            },
            required: ["symbol"],
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

export async function getAnalystResearch(symbol?: string, ...args: any[]): Promise<any> {
    // use Tavily API to search web, for use in gen AI responses
    if (!symbol) return "Stock symbol is required.";

    const query = `${symbol} stock target price`;

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