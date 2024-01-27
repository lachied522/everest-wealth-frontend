"use client";
import { useState } from "react";

import { useGlobalContext } from "@/context/GlobalState";

import StockCard from "./stock-card";

export default function UserWatchlist() {
    const { watchlist } = useGlobalContext();
    const [startIndex, setStartIndex] = useState<number>(0); //

    return (
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">My Watchlist</div>
            <div className="flex gap-6">
                {watchlist.length > 0 ? (
                <>
                    {watchlist.slice(startIndex, startIndex+3).map((symbol: string, index: number) => (
                    <StockCard key={index} symbol={symbol} />
                    ))}
                </>
                ) : (
                <div className="h-10 flex items-center">Nothing here yet.</div>
                )}
            </div>
        </div>
    )
}