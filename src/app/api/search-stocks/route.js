import { searchUniverse } from "src/app/lib/redis";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q').toLocaleUpperCase();

    const matches = await searchUniverse(q);
    
    console.log(matches);

    return new Response(JSON.stringify(matches), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}