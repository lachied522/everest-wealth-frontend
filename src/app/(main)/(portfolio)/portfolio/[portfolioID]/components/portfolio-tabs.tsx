"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { usePortfolioContext } from "@/context/portfolio/PortfolioState";
import PortfolioTable from "./PortfolioTable/portfolio-table";
import { columns as portfolioColumns } from "./PortfolioTable/portfolio-table-columns";
import RecommendationsTable from "./RecommendationsTable/recommendations-table";

import { PopulatedHolding } from "@/types/types";


// define tabs and columns to display
const TABS = [
    {
        tabName: "Recommendations",
        visibleColumns: []
    },
    {
        tabName: "Overview",
        visibleColumns: [
            "symbol",
            "name",
            "units",
            "totalCost",
            "value",
            "totalProfit"
        ]
    },
    {
        tabName: "Income",
        visibleColumns: [
            "symbol",
            "name",
            "totalCost",
            "value",
            "totalProfit",
            "div_yield",
        ]
    }
]

const AdviceNotification = ({ value }: { value: number }) => {
    if (!(value > 0)) return null;

    return (
        <div className="absolute flex top-0 right-0 items-center justify-center rounded-full h-4 w-4 text-xs bg-red-300 text-white">
            {value}
        </div>
    )
}

const PortfolioTabs = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentPortfolio } = usePortfolioContext();
    const [currentTab, setCurrentTab] = useState(TABS[1]); // keeps track of current tab, defaults to 'overview'
    // @ts-ignore: issue with ColumnDef type https://github.com/TanStack/table/issues/4241
    const [visibleColumns, setVisibleColumns] = useState(portfolioColumns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey))); 
    const [adviceNotification, setAdviceNotification] = useState(0); // shows user whether the advice tab is non-empty

    useEffect(() => {
        // get current tab
        const tab = TABS.find((tab) => tab.tabName===searchParams.get("tab"));
        if (tab) {
            setCurrentTab(tab);
        } else {
            // set 'Overview' tab as default
            router.push(`/portfolio/${currentPortfolio.id}?tab=${TABS[1].tabName}`);
        }
    }, [searchParams, router, currentPortfolio.id]);

    useEffect(() => {
        // update visible columns on tab change
        if (currentTab!==TABS[0]) {
            // @ts-ignore: issue with ColumnDef type https://github.com/TanStack/table/issues/4241
            const newColumns = portfolioColumns.filter((column: ColumnDef<PopulatedHolding | any>) => currentTab.visibleColumns.includes(column.accessorKey));
            setVisibleColumns(newColumns);
        }
    }, [currentTab]);

    const onTabClick = useCallback((index: number) => {
        router.push(`/portfolio/${currentPortfolio.id}?tab=${TABS[index].tabName}`);
    }, [router, currentPortfolio.id]);

    return (
        <>
            <div className="flex gap-3 mb-4 px-3">
            {TABS.map((tab, index) => (
                <div key={tab.tabName} className="relative">
                    {index===0 ? (
                    <>
                        <AdviceNotification value={adviceNotification}/>
                        <Button
                            variant="tab"
                            className={cn(
                                tab===currentTab && "underline"
                            )}
                            onClick={() => {onTabClick(index)}}
                        >
                            {tab.tabName}
                        </Button>
                    </>
                    ) : (
                    <Button
                        key={tab.tabName}
                        variant="tab"
                        className={cn(
                            tab===currentTab && "underline"
                        )}
                        onClick={() => {onTabClick(index)}}
                    >
                        {tab.tabName}
                    </Button>)}
                </div>
            ))}
            </div>
            {currentTab === TABS[0] ? (
                <RecommendationsTable setAdviceNotification={setAdviceNotification} />
            ) : (
                <PortfolioTable columns={visibleColumns} />
            )}
        </>
    )
};

export default PortfolioTabs;