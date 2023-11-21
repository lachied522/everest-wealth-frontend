"use client";
import { useMemo, useState } from "react";

import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LuArrowRightCircle, LuArrowLeftCircle } from "react-icons/lu";

import { useUniverseContext } from "@/context/UniverseState";

import StockCard from "./stock-card";


export default function FeaturedList() {
    const { universeDataMap } = useUniverseContext();
    const [index, setIndex] = useState(0); //

    const featured = useMemo(() => {
        // extract stocks with 'Featured' tag
        return Array.from(universeDataMap.values()).filter((obj) => obj.tags?.includes("Featured"));
    }, [universeDataMap]);

    return (
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">Featured Stocks</div>
            <div className="flex items-stretch gap-6">
                {featured.slice(index, index+3).map((stock) => (
                    <StockCard key={stock.id} data={stock} />
                ))}
            </div>
        </div>
    )
}