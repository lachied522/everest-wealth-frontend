"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

import { LuPlus, LuFileText, LuMinus } from "react-icons/lu";

import { useUniverseContext } from "@/context/UniverseState";
import { useGlobalContext } from "@/context/GlobalState";

export default function SymbolPage({ symbol }) {
    const { universeDataMap } = useUniverseContext();
    const { watchlist, toggleWatchlist } = useGlobalContext();
    

    const inWatchlist = useMemo(() => {
        console.log(watchlist);
        if (watchlist && watchlist?.length > 0) {
            return watchlist.includes(symbol);
        }
        return false;
    }, [watchlist]);

    const data = universeDataMap.get(symbol);

    return (
        <>
            <div className="flex justify-between">
                <h2>{data.name} ({data.symbol})</h2>
                <div className="flex gap-4">
                    <Button variant="secondary">
                        <LuFileText className="mr-2"/>
                        View Analyst Research
                    </Button>
                    {inWatchlist ? (
                    <Button
                        onClick={() => toggleWatchlist(symbol)}
                    >
                        <LuMinus className="mr-2"/>
                        Remove from Watchlist
                    </Button>
                    ) : (
                    <Button
                        onClick={() => toggleWatchlist(symbol)}
                    >
                        <LuPlus className="mr-2"/>
                        Add to Watchlist
                    </Button>
                    )}
                </div>
            </div>
            <div className="flex gap-2 items-end">
                <h3 className="mb-0">${data.last_price}</h3>
                <div className="text-green-500">+0.22%</div>
            </div>
            <div>{JSON.stringify(data)}</div>
        </>
    )
}