"use client";
import { useState, useMemo } from "react";

import { LuArrowRightCircle, LuArrowLeftCircle } from "react-icons/lu";

import { useGlobalContext } from "@/context/GlobalState";

import StockCard from "./stock-card";

export default function UserWatchlist() {
    const { watchlist } = useGlobalContext();
    const [index, setIndex] = useState(0); //

    return (
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">My Watchlist</div>
            <div className="flex gap-6">
                {watchlist.slice(index, index+3).map((symbol) => (
                    <StockCard key={index} symbol={symbol} />
                ))}
            </div>
        </div>
    )
}