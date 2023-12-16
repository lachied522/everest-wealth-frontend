import { searchUniverse } from "src/app/lib/redis";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    if (!searchParams===null && searchParams.has('q')) {
        const q = searchParams.get('q')?.toLocaleUpperCase(); 

        if (q) {
            const matches = await searchUniverse(q);
            return Response.json(matches);
        }
    };

    return Response.json([]);
}