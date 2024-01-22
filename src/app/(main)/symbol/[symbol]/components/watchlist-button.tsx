"use client";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { LuPlus, LuFileText, LuMinus, LuGlobe2 } from "react-icons/lu";

import { useGlobalContext, GlobalState } from "@/context/GlobalState";

export default function WatchlistButton({ symbol } : { symbol: string }) {
    const { watchlist, toggleWatchlist } = useGlobalContext() as GlobalState;

    const inWatchlist = useMemo(() => {
        if (watchlist && watchlist?.length > 0) {
            return watchlist.includes(symbol);
        }
        return false;
    }, [watchlist, symbol]);

    return (
        <>
            {inWatchlist ? (
            <Button
                onClick={() => toggleWatchlist(symbol)}
                variant="secondary"
                size="sm"
            >
                <span className="text-xs">Remove from Watchlist</span>
            </Button>
            ) : (
            <Button
                onClick={() => toggleWatchlist(symbol)}
                size="sm"
            >
                <LuPlus size={18} className="mr-2"/>
                <span className="text-xs">Add to Watchlist</span>
            </Button>
            )}
        </>
    )
}