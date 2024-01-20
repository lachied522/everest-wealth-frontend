"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import type { StockInfo } from "@/types/types";

export default function StockCard({ symbol }: { symbol: string | null }) {
    const [data, setData] = useState<StockInfo | null>(null);

    useEffect(() => {
        let active = true; // keep track of whether component is active
        getData();
        return () => {
            active = false;
        }

        async function getData() {
            const params = new URLSearchParams({ s: symbol! });
            const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
            if (active) setData(data);
        }
    }, [symbol]);

    if (!symbol) return null;

    return (
        <Link href={`/symbol/${symbol}`} className="no-underline">
            <Card className="w-48 h-full">
                <CardHeader>
                    <div className="max-w-[180px] truncate">{data?.['name']}</div>
                </CardHeader>
                <CardContent>
                    <div className="">${data?.['last_price']}</div>
                </CardContent>
            </Card>
        </Link>
    )
}