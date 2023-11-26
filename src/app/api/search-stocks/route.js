import { searchUniverse } from "src/app/lib/redis";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q').toLocaleUpperCase();

    const matches = await searchUniverse(q);
    
    return Response.json(matches);
}