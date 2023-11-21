"use client";
import { useState, useMemo } from "react";

import { LuArrowRightCircle, LuArrowLeftCircle } from "react-icons/lu";

import { useUniverseContext } from "@/context/UniverseState";
import { useGlobalContext } from "@/context/GlobalState";

import StockCard from "./stock-card";


export default function UserWatchlist() {
    const { universeDataMap } = useUniverseContext();
    const { watchlist } = useGlobalContext();
    const [index, setIndex] = useState(0); //

    const populatedWatchlist = useMemo(() => {
        // populate watchlist with stock data
        return watchlist.map((symbol) => universeDataMap.get(symbol));
    }, [universeDataMap]);

    return (
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">My Watchlist</div>
            <div className="flex gap-6">
                {populatedWatchlist.slice(index, index+3).map((stock) => (
                    <StockCard key={stock.id} data={stock} />
                ))}
            </div>
        </div>
    )
}