"use client";
import { useState, useEffect } from "react";

import {
    Card,
    CardContent
} from "@/components/ui/card";

import { 
    LuTarget,
    LuDollarSign,
    LuArrowUpRight, 
    LuArrowDownRight,
} from "react-icons/lu";

import { useUniverseContext } from "@/context/UniverseState";


const ChangeIndicator = ({ change }) => {
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


export default function PortfolioStatBar({ portfolio }) {
    const { universeDataMap } = useUniverseContext();
    const [totalValue, setTotalValue] = useState(0); //total portfolio value

    useEffect(() => {
        if (portfolio) {
            let newValue = 0;
            portfolio.data.forEach((obj) => {
                console.log(obj);
            });
            setTotalValue(newValue);
        };
    }, [portfolio]);
    
    return (
        <div className="gap-4 flex-wrap grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between grid mb-6">
            <Card>
                <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                    <LuTarget 
                        className="w-8 h-8"
                        color="#1d4ed8"
                    />
                    <div>
                        <div className="text-sm font-medium">Objective</div>
                        <div className="text-xs font-bold text-slate-800">{portfolio?.objective}</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-center content-center p-2 gap-2">
                    <LuDollarSign 
                        className="w-8 h-8"
                        color="#1d4ed8"
                    />
                    <div>
                        <div className="text-sm font-medium">Value</div>
                        <div className="text-xs font-bold text-slate-800">${totalValue?.toLocaleString() || 0}</div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-center p-2 gap-2">
                    <div>
                        <div className="text-sm font-medium">Week return</div>
                        <ChangeIndicator change={3.1}/>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="flex items-center justify-center p-2 gap-2">
                    <div>
                        <div className="text-sm font-medium">Total return</div>
                        <ChangeIndicator change={-2.8}/>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}