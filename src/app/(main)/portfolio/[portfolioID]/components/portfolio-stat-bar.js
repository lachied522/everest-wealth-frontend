"use client";
import { useMemo, useEffect } from "react";

import { 
    LuTarget,
    LuDollarSign,
    LuArrowUpRight, 
    LuArrowDownRight,
} from "react-icons/lu";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalContext } from "@/context/GlobalState";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const DayReturn = ({ portfolio }) => {

    const dollarChange = useMemo(() => {
        return portfolio.holdings.reduce((acc, obj) => acc + parseFloat(obj.units) * parseFloat(obj.change || 0), 0);
    }, [portfolio]);

    const change = 100*(dollarChange / portfolio.totalValue);

    return (
        <div className="flex items-end">
            <div className="text-lg text-slate-800 font-bold mr-1">{USDollar.format(dollarChange)}</div>
            <div className="text-100 medium mg-bottom-4px">
                <div className="flex">
                    <div className={change > 0? "text-green-600": "text-red-400"}>{change.toFixed(2)}%</div>
                    {change > 0 ? (
                    <LuArrowUpRight className="text-green-600"/>
                    ) : (
                    <LuArrowDownRight className="text-red-400"/>
                    )}
                </div>
            </div>
        </div>
    )
}

const TotalReturn = ({ portfolio }) => {

    const totalCost = useMemo(() => {
        return portfolio.holdings.reduce((acc, obj) => acc + parseFloat(obj.cost || 0), 0);
    }, [portfolio]);
    
    const change = ((portfolio.totalValue / totalCost) - 1);

    return (
        <div className="flex items-end">
            <div className="text-lg text-slate-800 font-bold mr-1">{USDollar.format(portfolio.totalValue - totalCost)}</div>
            <div className="text-100 medium mg-bottom-4px">
                <div className="flex">
                    <div className={change > 0? "text-green-600": "text-red-400"}>{change.toFixed(2)}%</div>
                    {change > 0 ? (
                    <LuArrowUpRight className="text-green-600"/>
                    ) : (
                    <LuArrowDownRight className="text-red-400"/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function PortfolioStatBar() {
    const { currentPortfolio } = useGlobalContext();
    
    return (
        <div className="gap-4 flex-wrap grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between grid mb-6">
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