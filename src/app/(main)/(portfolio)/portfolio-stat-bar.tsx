"use client";
import { useMemo, useEffect } from "react";

import { 
    LuTarget,
    LuDollarSign,
    LuArrowUpRight, 
    LuArrowDownRight,
    LuMinus,
} from "react-icons/lu";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/components/lib/utils";

import { PortfolioState, usePortfolioContext } from "@/context/PortfolioState";

import type { PortfolioData } from "@/types/types";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const DayReturn = ({ portfolio }: { portfolio: PortfolioData }) => {

    const dollarChange = useMemo(() => {
        if (portfolio.holdings.length > 0) return portfolio.holdings.reduce(
            (acc, obj) => acc + obj.units * (obj?.change || 0), 0
        );
        return 0;
    }, [portfolio.holdings]);

    const change = useMemo(() => {
        if (portfolio.totalValue > 0) return 100*(dollarChange / portfolio.totalValue);
        return 0;
    }, [portfolio.totalValue]);

    return (
        <div className="flex items-center">
            <div className="text-lg text-slate-800 font-bold mr-1">{USDollar.format(dollarChange)}</div>
            <div className="text-100 medium mg-bottom-4px">
                <div className="flex items-center">
                    <div className={cn(
                        "text-sm text-green-600",
                        change === 0 && "text-slate-600",
                        change < 0 && "text-red-400"
                    )}>
                        {change.toFixed(2)}%
                    </div>
                    {change === 0 ? (
                    <LuMinus className="text-slate-600" />
                    ) : change < 0 ? (
                    <LuArrowDownRight className="text-red-400"/>
                    ) : (
                    <LuArrowUpRight className="text-green-600"/>
                    )}
                </div>
            </div>
        </div>
    )
}

const TotalReturn = ({ portfolio }: { portfolio: PortfolioData }) => {

    const totalCost = useMemo(() => {
        if (portfolio.holdings.length > 0) return portfolio.holdings.reduce((acc, obj) => acc + (obj.totalCost || 0), 0);
        return 0;
    }, [portfolio.holdings]);
    
    const change = useMemo(() => {
        if (totalCost > 0) return (portfolio.totalValue / totalCost) - 1;
        return 0;
    }, [portfolio.totalValue, totalCost]);

    return (
        <div className="flex items-center">
            <div className="text-lg text-slate-800 font-bold mr-1">{USDollar.format(portfolio.totalValue - totalCost)}</div>
            <div className="text-100 medium mg-bottom-4px">
                <div className="flex items-center">
                    <div className={cn(
                        "text-sm text-green-600",
                        change === 0 && "text-slate-600",
                        change < 0 && "text-red-400"
                    )}>
                        {change.toFixed(2)}%
                    </div>
                    {change === 0 ? (
                    <LuMinus className="text-slate-600" />
                    ) : change < 0 ? (
                    <LuArrowDownRight className="text-red-400"/>
                    ) : (
                    <LuArrowUpRight className="text-green-600"/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function PortfolioStatBar() {
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    
    return (
        <div className="grid flex-wrap grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between gap-4 mb-6">
            <Card className="h-full flex items-center justify-center">
                <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                    {currentPortfolio ? (
                    <>
                        <LuTarget 
                            className="w-8 h-8"
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Objective</div>
                            <div className="text-xs font-bold text-slate-800">{currentPortfolio.objective}</div>
                        </div>
                    </>
                    ) : <Skeleton className="w-[240px] h-10"/>}
                </CardContent>
            </Card>
            <Card className="h-full flex items-center justify-center">
                <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                    {currentPortfolio ? (  
                    <>
                        <LuDollarSign 
                            className="w-8 h-8"
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Value</div>
                            <div className="text-lg text-slate-800 font-bold mr-1">${currentPortfolio.totalValue.toLocaleString() || 0}</div>
                        </div>
                    </>
                    ) : <Skeleton className="w-[240px] h-10"/>}
                </CardContent>
            </Card>
            <Card className="h-full flex items-center justify-center">
                <CardContent className="flex items-center justify-center p-2 gap-2">
                    {currentPortfolio ? (
                    <div>
                        <div className="text-sm font-medium">Day return</div>
                        <DayReturn portfolio={currentPortfolio}/>
                    </div>
                    ) : <Skeleton className="w-[240px] h-10"/>}
                </CardContent>
            </Card>
            <Card className="h-full flex items-center justify-center">
                <CardContent className="flex items-center justify-center p-2 gap-2">
                    {currentPortfolio ? (
                    <div>
                        <div className="text-sm font-medium">Total return</div>
                        <TotalReturn portfolio={currentPortfolio}/>
                    </div>
                    ) : <Skeleton className="w-[240px] h-10"/>}
                </CardContent>
            </Card>
        </div>
    )
}