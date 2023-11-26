"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";

import { LuPlus, LuFileText, LuMinus, LuGlobe2 } from "react-icons/lu";

import { GiAustralia } from "react-icons/gi";

import { useGlobalContext } from "@/context/GlobalState";

function formatMarketCap(marketCap) {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;
  
    if (Math.abs(marketCap) >= trillion) {
      return `$${(marketCap / trillion).toFixed(2)}T`;
    } else if (Math.abs(marketCap) >= billion) {
      return `$${(marketCap / billion).toFixed(2)}B`;
    } else if (Math.abs(marketCap) >= million) {
      return `$${(marketCap / million).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  }

export default function SymbolPage({ jsonData }) {
    const { watchlist, toggleWatchlist } = useGlobalContext();
    
    const data = useMemo(() => {
        return JSON.parse(jsonData);
    }, [jsonData]);

    const inWatchlist = useMemo(() => {
        if (watchlist && watchlist?.length > 0) {
            return watchlist.includes(data['symbol']);
        }
        return false;
    }, [watchlist]);

    console.log(data);

    return (
        <>
            <div className="mb-16">
                <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="mb-0">{data['name']}</h2>
                        <h4 className="mb-0">({data['symbol']})</h4>
                        {data['domestic'].toLowerCase()==="true" ? <GiAustralia size={21} /> : <LuGlobe2 size={21} />}
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" size="sm">
                            <LuFileText className="mr-2"/>
                            <span className="text-xs">View Analyst Research</span>
                        </Button>
                        {inWatchlist ? (
                        <Button
                            onClick={() => toggleWatchlist(data['symbol'])}
                            size="sm"
                        >
                            <LuMinus className="mr-2"/>
                            <span className="text-xs">Remove from Watchlist</span>
                        </Button>
                        ) : (
                        <Button
                            onClick={() => toggleWatchlist(data['symbol'])}
                            size="sm"
                        >
                            <LuPlus className="mr-2"/>
                            <span className="text-xs">Add to Watchlist</span>
                        </Button>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-end mb-4">
                    <h3 className="mb-0">${data['last_price']}</h3>
                    <div className="text-green-500">+0.22%</div>
                </div>
                <div className="flex gap-4">
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Market cap</span>
                        {formatMarketCap(data['market_cap'])}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Dividend amount</span>
                        ${data['div']}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Dividend yield</span>
                        {(100 * parseFloat(data['div_yield'])).toFixed(2)}%
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">P/E</span>
                        {parseFloat(data['PE']).toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Sector</span>
                        {data['sector'].charAt(0).toUpperCase() + data['sector'].slice(1).toLowerCase()}
                    </div>
                </div>
            </div>
            <div className="">
                <div className="w-[60vh]">
                    <h3>About the company</h3>
                    <p className="text-xs">{data['description']}</p>
                </div>
                <div>
                    <h3>Latest News</h3>
                </div>
            </div>
        </>
    )
}