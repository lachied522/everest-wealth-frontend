import { fetchSymbol } from "src/app/lib/redis";

import { Button } from "@/components/ui/button";
import { 
    LuPlus,
    LuFileText,
    LuMinus,
    LuGlobe2,
    LuArrowUpRight, 
    LuArrowDownRight,
} from "react-icons/lu";
import { GiAustralia } from "react-icons/gi";

import { cn } from "@/components/lib/utils";

import WatchlistButton from "./components/watchlist-button";
import TradingViewWidget from "./components/TradingViewWidget";
import TradingViewNewsWidget from "./components/TradingViewNewsWidget";

import type { StockInfo } from "@/types/types";

function formatMarketCap(marketCap: number | null) {
    if (!marketCap) return 'N/A';
    
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

function getTradingViewSymbol(data: StockInfo) {
    if (data.domestic) return `ASX:${data.symbol}`;

    if (!data.domestic && !data.active) return `AMEX:${data.symbol}`

    return data.symbol;
}

const ChangeIndicator = ({ last, change }: { last: number | null, change: number | null }) => {
    const percentChange = (change && last)? 100*(change / last): 0;

    return (
        <div className="flex items-center gap-1">
            <div className={cn(
                "text-sm text-green-600",
                percentChange === 0 && "text-slate-600",
                percentChange < 0 && "text-red-400"
            )}>
                {percentChange.toFixed(2)}%
            </div>
            {percentChange === 0 ? (
            <LuMinus className="text-slate-600" />
            ) : percentChange < 0 ? (
            <LuArrowDownRight className="text-red-400"/>
            ) : (
            <LuArrowUpRight className="text-green-600"/>
            )}
        </div>
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

    return (
        <>
            <div className="mb-16">
                <div className="flex justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-slate-900 font-bold text-2xl">
                            {`${data.name} (${data.symbol})`}
                        </div>
                        {data.domestic ? <GiAustralia size={21} color="black"/> : <LuGlobe2 size={21} color="black"/>}
                    </div>
                    <div className="flex gap-4">
                        <Button variant="secondary" size="sm">
                            <LuFileText size={18} className="mr-2"/>
                            <span className="text-xs">Analyst Research</span>
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
                        {data.PE? data.PE.toFixed(2): 'N/A'}
                    </div>
                    <div className="flex gap-2">
                        <span className="text-slate-800 font-semibold">Sector</span>
                        {data.sector}
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                <div className="h-[400px] grid grid-cols-[1fr_0.25fr] gap-24">
                    <div className="">
                        <h3 className="text-xl font-medium mb-3">About</h3>
                        <p className="text-xs">{data.description}</p>
                    </div>
                    <div className="">
                        <h3 className="text-xl font-medium mb-3">Chart</h3>
                        <TradingViewWidget symbol={getTradingViewSymbol(data)} />
                    </div>
                </div>
                <div className="w-full flex flex-col items-center gap-6 p-6">
                    <h3 className="text-xl font-medium mb-3">Latest News</h3>
                    <TradingViewNewsWidget symbol={getTradingViewSymbol(data)} />
                </div>
            </div>
        </>
    )
}