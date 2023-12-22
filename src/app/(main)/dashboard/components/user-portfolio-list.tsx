"use client";
import { useState } from "react";
import Link from "next/link";

import { BiBriefcaseAlt } from "react-icons/bi";
import { 
    LuTarget,
    LuDollarSign,
    LuArrowUpRight, 
    LuArrowDownRight,
    LuFileLineChart,
    LuFileBarChart,
    LuPlus,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";

import { GlobalState, PortfolioData, useGlobalContext } from "@/context/GlobalState";
import NewPortfolioPopup from "@/components/modals/new-portfolio-popup";

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
        <div className="grid items-end justify-start md:grid-cols-2 gap-2">
            <div className="flex flex-col items-stretch gap-2">
                <div className="text-lg font-medium text-slate-700">{portfolio.name}</div>
                <div className="grid grid-cols-2 gap-2 pl-2">
                    <div className="flex items-center gap-2">
                        <LuTarget 
                            className="w-5 h-5"
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Objective</div>
                            <div className="w-[180px] text-xs font-bold text-slate-800 text-wrap">{portfolio.objective}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <LuDollarSign
                            className="w-5 h-5"
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Value</div>
                            <div className="text-xs text-slate-800 font-bold mr-1">${portfolio.totalValue.toLocaleString() || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-2 md:justify-self-end">
                <Link href={`/portfolio/${portfolio.id}`} className="no-underline">
                    <Button variant='ghost' size='sm' className="flex text-slate-700 gap-2">
                        <BiBriefcaseAlt />
                        Portfolio
                    </Button>
                </Link>
                <Link href={`/performance/${portfolio.id}`} className="no-underline">
                    <Button variant='ghost' size='sm' className="flex text-slate-700 gap-2">
                        <LuFileLineChart />
                        Performance
                    </Button>
                </Link>
                <Link href={`/advice/${portfolio.id}`} className="no-underline">
                    <Button variant='ghost' size='sm' className="flex text-slate-700 gap-2">
                        <LuFileBarChart />
                        Advice
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default function UserPortfolioList() {
    const { portfolioData } = useGlobalContext() as GlobalState;
    const [visibleIndex, setVisibleIndex] = useState(2);
    
    return (
        <>
            <div className="mb-8">
            <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-slate-800 mb-0">
                    My Portfolios
                </div>
                <NewPortfolioPopup>
                    <Button>
                        <LuPlus
                            className="mr-2"
                        />
                        New Portfolio
                    </Button>
                </NewPortfolioPopup>
            </div>
            </div>
            <div className="grid md:grid-cols-1 gap-8 px-8">
                {portfolioData.map((portfolio, index) => (
                    <PortfolioListItem 
                        key={index}
                        portfolio={portfolio}
                    />
                ))}
            </div>
        </>
    );
}
