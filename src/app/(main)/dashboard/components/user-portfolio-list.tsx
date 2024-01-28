"use client";
import Link from "next/link";

import { BiBriefcaseAlt } from "react-icons/bi";
import { 
    LuTarget,
    LuDollarSign,
    LuFileLineChart,
    LuFileBarChart,
    LuPlus,
    LuUser2,
    LuFactory,
    LuUsers2,
    LuScrollText,
    LuPiggyBank,
} from "react-icons/lu";

import { Button } from "@/components/ui/button";

import { GlobalState, useGlobalContext } from "@/context/GlobalState";
import NewPortfolioPopup from "@/components/modals/new-portfolio-popup";

import type { PortfolioData } from "@/types/types";


const EntityMap: { [key: string]: typeof LuUser2 } = {
    individual: LuUser2,
    joint: LuUsers2,
    company: LuFactory,
    trust: LuScrollText,
    super: LuPiggyBank,
}

const PortfolioEntityIndicator = ({ entity } : { entity: string }) => {
    let Icon;
    if (EntityMap.hasOwnProperty(entity)) {
        Icon = EntityMap[entity]
    } else {
        Icon = LuUser2
    };

    return (
        <div className="flex items-center gap-2">
            <Icon
                size={24}
                color="#1d4ed8"
            />
            <div>
                <div className="text-sm font-medium">Entity</div>
                <div className="text-xs text-slate-800 font-bold mr-1">{entity.charAt(0).toUpperCase() + entity.slice(1)}</div>
            </div>
        </div>
    )
}

const PortfolioListItem = ({ portfolio }: { portfolio: PortfolioData }) => {

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 justify-stretch gap-6 xl:gap-0">
            <div className="flex flex-col items-stretch justify-end gap-2">
                <div className="text-lg font-medium text-slate-700">{portfolio.name}</div>
                <div className="grid grid-cols-[200px_1fr_1fr] place-items-center gap-4 pl-2">
                    <div className="grid grid-cols-[32px_1fr] items-center gap-2 place-self-start">
                        <LuTarget 
                            size={24}
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Objective</div>
                            <div className="max-w-[160px] text-xs font-bold text-slate-800 truncate">{portfolio.objective}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PortfolioEntityIndicator entity={portfolio.entity} />
                    </div>
                    <div className="flex items-center gap-2">
                        <LuDollarSign
                            size={24}
                            color="#1d4ed8"
                        />
                        <div>
                            <div className="text-sm font-medium">Value</div>
                            <div className="text-xs text-slate-800 font-bold mr-1">${portfolio.totalValue.toLocaleString() || 0}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-end justify-center justify-self-center xl:justify-self-end gap-2">
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
    
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h4 className="text-xl font-medium text-slate-800 mb-0">
                    My Portfolios
                </h4>
                <NewPortfolioPopup>
                    <Button>
                        <LuPlus
                            className="mr-2"
                        />
                        New Portfolio
                    </Button>
                </NewPortfolioPopup>
            </div>
            <div className="grid md:grid-cols-1 gap-8 px-8">
                {portfolioData.map((portfolio, index) => (
                    <PortfolioListItem 
                        key={index}
                        portfolio={portfolio}
                    />
                ))}
            </div>
        </div>
    );
}
