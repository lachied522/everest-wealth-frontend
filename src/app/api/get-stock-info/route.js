import { cache } from "react";

import cachedFetch from "src/app/lib/cached-fetch";

// const cachedFetch = cache(fetchSymbol);

// NOTE: next is supposed to cachce calls to this endpoint automatically but it doesn't appear to be the case

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('s');

    if (!symbol) return Response.json({});

    const data = await cachedFetch(symbol);
    
    return Response.json(data);
}