"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/components/lib/utils";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";

import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

import PerformanceChart from "./performance-chart";
import DividendChart from "./dividend-chart";

import PerformanceSummaryTable from "./performance-summary";

import type { TimeSeriesDataPoint } from '@/types/types';

const TABS = [
    {
        tabName: "Performance"
    },
    {
        tabName: "Income"
    },
]

interface PortfolioPerformanceTabsProps {
    performance: TimeSeriesDataPoint[]
    dividends: TimeSeriesDataPoint[]
    benchmark: TimeSeriesDataPoint[]
}

export default function PerformanceTabs({
    performance,
    dividends,
    benchmark,
}: PortfolioPerformanceTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const [currentTab, setCurrentTab] = useState<typeof TABS[number]>(TABS[0]);

    useEffect(() => {
        // get current tab
        const tab = TABS.find((tab) => tab.tabName===searchParams.get("tab"));
        if (tab) {
            setCurrentTab(tab);
        } else {
            // set 'Performance' tab as default
            router.push(`/performance/${currentPortfolio.id}?tab=${TABS[0].tabName}`);
        }
    }, [searchParams, router, currentPortfolio.id]);

    const onTabClick = useCallback((index: number) => {
        router.push(`/performance/${currentPortfolio.id}?tab=${TABS[index].tabName}`);
    }, [router, currentPortfolio.id]);

    return (
        <>
            <div className="flex gap-3 mb-4 px-3">
                {TABS.map((tab, index) => (
                <div key={`button-${tab.tabName}-tab`}>
                    <Button
                        key={tab.tabName}
                        variant="tab"
                        className={cn(
                            "text-base",
                            tab===currentTab && "underline"
                        )}
                        onClick={() => {onTabClick(index)}}
                    >
                        {tab.tabName}
                    </Button>
                </div>
                ))}
            </div>
            <div className="w-full flex flex-col itmes-center justify-center p-6">
                <Card className='w-full'>
                    <CardContent className='flex flex-col items-center justify-center p-6 gap-6'>
                        {currentTab===TABS[0] ? (
                        <PerformanceChart data={performance} benchmark={benchmark} name={currentPortfolio.name} />
                        ) : currentTab===TABS[1] ? (
                        <DividendChart data={dividends} />
                        ) : null}
                        <PerformanceSummaryTable performance={performance} dividends={dividends} />
                    </CardContent>
                </Card>
            </div>
        </>
    )
}