"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function StockCard({ symbol }) {
    const [data, setData] = useState(null);

    useEffect(() => {
        let active = true; // keep track of whether component is active
        getData();
        return () => {
            active = false;
        }

        async function getData() {
            const params = new URLSearchParams({ s: symbol });
            const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
            if (active) setData(data);
        }
    }, [symbol]);

    return (
        <Link href={`/symbol/${symbol}`} className="no-underline">
            <Card className="w-64 h-full">
                <CardHeader>{data?.['name']}</CardHeader>
                <CardContent>
                    <div className="">${data?.['last_price']}</div>
                </CardContent>
            </Card>
        </Link>
    )
}