"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { 
    LuArrowUpRight, 
    LuArrowDownRight,
    LuMinus,
} from "react-icons/lu";

import { cn } from "@/components/lib/utils";

import type { StockInfo } from "@/types/types";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

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

    if (!data) return null;

    return (
        <Link href={`/symbol/${symbol}`} className="no-underline">
            <Card className="w-48 h-full">
                <CardHeader>
                    <div className="max-w-[180px] flex flex-col gap-2">
                        <div className="text-base truncate">{data.symbol}</div>
                        <div className="text-sm truncate">{data.name}</div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-1">
                        <div className="text-sm">{USDollar.format(data.last_price)}</div>
                        <div className="flex items-center gap-0.5">
                            <div className={cn(
                                "text-xs text-green-600",
                                data.change === 0 && "text-slate-600",
                                data.change < 0 && "text-red-400"
                            )}>
                                {data.change.toFixed(2)}%
                            </div>
                            {data.change === 0 ? (
                            <LuMinus size={12} className="text-slate-600" />
                            ) : data.change < 0 ? (
                            <LuArrowDownRight size={12} className="text-red-400"/>
                            ) : (
                            <LuArrowUpRight size={12} className="text-green-600"/>
                            )}
                        </div>

                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}