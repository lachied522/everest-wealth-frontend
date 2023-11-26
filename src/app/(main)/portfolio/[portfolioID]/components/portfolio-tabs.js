"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { useUniverseContext } from "src/app/(main)/context/UniverseState";

import { addStockInfoToPortfolio } from "../utils";
import { addInfoToTransactions } from "../utils";

import AdviceTable from "@/components/advice-table";
import PortfolioTable from "./portfolio-table";
import { columns as portfolioColumns } from "./portfolio-columns";
import { useGlobalContext } from "@/context/GlobalState";

//define tabs and columns to display
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

const AdviceNotification = ({ transactions }) => {
    if (!(transactions?.length > 0)) return null;

    return (
        <div className="absolute flex top-0 right-0 items-center justify-center rounded-full h-4 w-4 text-xs bg-red-300 text-white">
            {transactions.length}
        </div>
    )
}

const PortfolioTabs = ({ loadingNewAdvice }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { universeDataMap } = useUniverseContext();
    const { currentPortfolio, updatePortfolio } = useGlobalContext();
    const [currentTab, setCurrentTab] = useState(TABS[1]); // keeps track of current tab, defaults to 'overview'
    const [portfolioData, setPortfolioData] = useState([]);

    useEffect(() => {
        // get current tab
        const tab = TABS.find((tab) => tab.tabName===searchParams.get("tab"));
        if (tab) {
            setCurrentTab(tab);
        } else {
            // set 'Overview' tab as default
            router.push(`/portfolio/${currentPortfolio.id}?tab=${TABS[1].tabName}`);
        }
    }, [searchParams]);

    useEffect(() => {
        let active = true; // keep track of whether component is active
        if (currentPortfolio) getData();
        return () => {
            active = false;
        }

        async function getData() {
            const data = await addStockInfoToPortfolio(currentPortfolio.holdings);
            if (active) setPortfolioData(data);
        }
    }, [currentPortfolio]);

    const adviceData = useMemo(() => {
        if (currentPortfolio && universeDataMap) {
            // set advice data
            const advice = currentPortfolio.advice[0];
            if (!advice?.actioned && advice?.transactions) {
                return addInfoToTransactions(advice.transactions, universeDataMap);
            }
        };
        return [];
    }, [currentPortfolio]);

    const visibleColumns = useMemo(() => {
        // update visible columns on tab change
        return portfolioColumns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey));
    }, [currentTab]);

    const onTabClick = (index) => {
        router.push(`/portfolio/${currentPortfolio.id}?tab=${TABS[index].tabName}`);
    }

    const onAdviceConfirm = () => {
        fetch('api/confirm-advice', {
            method: "POST",
            body: JSON.stringify(currentPortfolio.advice[0]),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => res.json())
        .then(updatedHoldings => {
            const updatedSymbols = Array.from(updatedHoldings, (obj) => { return obj.symbol });

            const newHoldings = [
                    ...currentPortfolio.holdings.filter((holding) => !updatedSymbols.includes(holding.symbol)),
                    ...updatedHoldings,
                ];

            console.log(newHoldings);
            updatePortfolio(currentPortfolio.id, newHoldings)
            // show loading animation
            // setCurrentTab(TABS[1]);
            // toggleAdviceActioned(currentPortfolio.id);
        })
        .catch(err => console.log(err))
        .finally(() => {

        });

    }

    return (
        <>
            <div className="flex gap-3 mb-4 px-3">
            {TABS.map((tab, index) => (
                <div key={tab.tabName} className="relative">
                    {tab.tabName==='Recommendations' ? (
                    <>
                        <AdviceNotification transactions={adviceData}/>
                        <Button
                            variant="tab"
                            className={cn(
                                tab === currentTab && "underline"
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
                            tab === currentTab && "underline"
                        )}
                        onClick={() => {onTabClick(index)}}
                    >
                        {tab.tabName}
                    </Button>)}
                </div>
            ))}
            </div>
            {currentTab === TABS[0] ? (
                <AdviceTable data={adviceData} onClick={onAdviceConfirm} loadingNewAdvice={loadingNewAdvice} statementUrl={currentPortfolio.advice[0]?.url} />
            ) : (
                <PortfolioTable columns={visibleColumns} data={portfolioData} />
            )}
        </>
    )
};

export default PortfolioTabs;