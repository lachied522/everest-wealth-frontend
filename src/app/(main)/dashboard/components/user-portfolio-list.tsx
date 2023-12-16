"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BiHomeAlt2, BiBriefcaseAlt } from "react-icons/bi";
import { 
    LuTarget,
    LuDollarSign,
    LuArrowUpRight, 
    LuArrowDownRight,
    LuFileLineChart,
    LuFileBarChart,
    LuUser2,
    LuSettings
} from "react-icons/lu";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { GlobalState, PortfolioData, useGlobalContext } from "@/context/GlobalState";

const ChangeIndicator = ({ change }: { change: number }) => {
    return (
        <div className="flex items-end">
            <div className="text-lg text-slate-800 font-bold mr-1">4.5K</div>
            <div className="text-100 medium mg-bottom-4px">
                <div className="flex">
                    <div className={change > 0? "text-green-600": "text-red-400"}>{change}%</div>
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

const PortfolioListItem = ({ portfolio }: { portfolio: PortfolioData }) => {

    return (
        <>
            <div className="">
                {portfolio? (
                    <div className="text-xl font-medium text-slate-800">{portfolio.name}</div>
                ): <Skeleton className="w-[240px] h-10"/>}
            </div>
            <div className="grid grid-cols-5 items-center justify-between gap-4">
                <Card className="h-full flex items-center justify-center">
                    <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                        {portfolio ? (
                        <>
                            <LuTarget 
                                className="w-8 h-8"
                                color="#1d4ed8"
                            />
                            <div>
                                <div className="text-sm font-medium">Objective</div>
                                <div className="text-xs font-bold text-slate-800">{portfolio.objective}</div>
                            </div>
                        </>
                        ) : <Skeleton className="w-[240px] h-10"/>}
                    </CardContent>
                </Card>
                <Card className="h-full flex items-center justify-center">
                    <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                        {portfolio ? (  
                        <>
                            <LuDollarSign 
                                className="w-8 h-8"
                                color="#1d4ed8"
                            />
                            <div>
                                <div className="text-sm font-medium">Value</div>
                                <div className="text-lg text-slate-800 font-bold mr-1">${portfolio.totalValue.toLocaleString() || 0}</div>
                            </div>
                        </>) : <Skeleton className="w-[240px] h-10"/>}
                    </CardContent>
                </Card>
                <Link href={`/portfolio/${portfolio.id}`}>
                    <Button variant="secondary">
                        View Portfolio
                    </Button>
                </Link>
            </div>
        </>
    )
}

export default function UserPortfolioList() {
    const { portfolioData } = useGlobalContext() as GlobalState;
    const [visibleIndex, setVisibleIndex] = useState(2);
    
    return (
        <div className="grid grid-cols-1 gap-8">
            {portfolioData.map((portfolio, index) => (
                <PortfolioListItem 
                    key={index}
                    portfolio={portfolio}
                />
            ))}
        </div>
    );
}
