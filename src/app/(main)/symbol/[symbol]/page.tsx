import { notFound } from "next/navigation";

import { fetchSymbol } from "src/app/lib/redis";

import { Button } from "@/components/ui/button";
import { LuPlus, LuFileText, LuMinus, LuGlobe2 } from "react-icons/lu";
import { GiAustralia } from "react-icons/gi";

import WatchlistButton from "./components/watchlist-button";
import TradingViewWidget from "./components/TradingViewWidget";
import TradingViewNewsWidget from "./components/TradingViewNewsWidget";

function formatMarketCap(marketCap: number | null) {
    if (!marketCap) return
    
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

function ChangeIndicator({ last, change }: { last: number, change: number }) {
    if (!change || !last) return <div className="text-green-500">+0%</div>;

    const percentChange = 100*(change / last);

    if (percentChange < 0) return (
        <div className="text-red-500">{percentChange.toFixed(2)}%</div>
    )

    return (
        <div className="text-green-500">+{percentChange.toFixed(2)}%</div>
    )
}

interface PageProps {
    params: {
        symbol: string
    }
}

export default async function Page({ params }: PageProps) {
    const data = await fetchSymbol(params.symbol);

    if (!data) {
        return (
            <div className="text-slate-700">Symbol not found</div>
        )
    }

    console.log(data);

    return (
        <>
            <div className="mb-16">
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-slate-900 font-bold text-3xl">
                            {data.name}
                            <span className="ml-2 text-xl">({data.symbol})</span>
                        </div>
                        {data.domestic ? <GiAustralia size={21} color="black"/> : <LuGlobe2 size={21} color="black"/>}
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" size="sm">
                            <LuFileText className="mr-2"/>
                            <span className="text-xs">View Analyst Research</span>
                        </Button>
                        <WatchlistButton symbol={data.symbol} />
                    </div>
                </div>
                <div className="flex gap-2 items-end mb-4">
                    <h3 className="mb-0">${data.last_price}</h3>
                    <ChangeIndicator change={data.change || 0} last={data.last_price} />
                </div>
                <div className="flex gap-4">
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Market cap</span>
                        {formatMarketCap(data.market_cap)}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Dividend amount</span>
                        ${data.div}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Dividend yield</span>
                        {(100 * (data.div_yield || 0)).toFixed(2)}%
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">P/E</span>
                        {data['PE']? data['PE'].toFixed(2): 'NaN'}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Sector</span>
                        {data.sector}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="grid grid-cols-[1fr_0.25fr] gap-16">
                    <div className="">
                        <h3>About the company</h3>
                        <p className="text-xs">{data.description}</p>
                    </div>
                    <div className="">
                        <h3>Price chart</h3>
                        <TradingViewWidget symbol={data.domestic? `ASX:${data.symbol}`: `NASDAQ:${data.symbol}`} />
                    </div>
                </div>
                <div>
                    <h3>Latest News</h3>
                </div>
                <div className="w-full flex items-center">
                    <TradingViewNewsWidget symbol={data.domestic? `ASX:${data.symbol}`: `NASDAQ:${data.symbol}`} />
                </div>
            </div>
        </>
    )
}