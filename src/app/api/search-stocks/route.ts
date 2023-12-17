import { searchUniverse } from "src/app/lib/redis";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    if (searchParams) {
        const q = searchParams.get('q'); 

        if (q) {
            const matches = await searchUniverse(q);
            return Response.json(matches);
        }
    };

    return Response.json([]);
}