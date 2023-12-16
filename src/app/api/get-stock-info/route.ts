import { fetchSymbol } from "src/app/lib/redis";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('s');

    if (!symbol) return Response.json({});

    const data = await fetchSymbol(symbol);
    
    return Response.json(data);
}