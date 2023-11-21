import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function StockCard({ data }) {
    return (
        <Link href={`/symbol/${data.symbol}`} className="no-underline">
            <Card className="w-64 h-full">
                <CardHeader>{data?.name}</CardHeader>
                <CardContent>
                    <div className="">${data?.last_price}</div>
                </CardContent>
            </Card>
        </Link>
    )
}