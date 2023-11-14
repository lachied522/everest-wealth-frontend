"use client";
import { useState, useEffect, useMemo } from "react";

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

const PortfolioTabs = ({ loadingNewData, loadingNewAdvice }) => {
    const { universeDataMap } = useUniverseContext();
    const { currentPortfolio, updatePortfolio, toggleAdviceActioned } = useGlobalContext();
    const [currentData, setCurrentData] = useState([]);
    const [currentTransactionsData, setCurrentTransactionsData] = useState([]);
    const [currentTab, setCurrentTab] = useState(TABS[1]); // keeps track of current tab, defaults to 'overview'

    useEffect(() => {
        if (currentPortfolio && universeDataMap) {
            // set holding data for portfolio
            setCurrentData(addStockInfoToPortfolio(currentPortfolio.holdings, universeDataMap));
            // set advice data
            const advice = currentPortfolio.advice[0];
            if (!advice?.actioned && advice?.transactions) {
                setCurrentTransactionsData(
                    addInfoToTransactions(advice.transactions, universeDataMap)
                );
            } else {
                setCurrentTransactionsData([])
            }
        };
    }, [currentPortfolio]);

    const visibleColumns = useMemo(() => {
        // update visible columns on tab change
        return portfolioColumns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey));
    }, [currentTab]);

    useEffect(() => {
        // switch to 'overview' tab
        if (loadingNewData) setCurrentTab(TABS[1]);
    }, [loadingNewData]);

    useEffect(() => {
        // switch to 'recommendations' tab
        if (loadingNewAdvice) setCurrentTab(TABS[0]);
    }, [loadingNewAdvice]);

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
            {TABS.map(tab => (
                <div key={tab.tabName} className="relative">
                    {tab.tabName==='Recommendations' ? (
                    <>
                        <AdviceNotification transactions={currentTransactionsData}/>
                        <Button
                            variant="tab"
                            className={cn(
                                tab === currentTab && "underline"
                            )}
                            onClick={() => {setCurrentTab(tab)}}
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
                        onClick={() => {setCurrentTab(tab)}}
                    >
                        {tab.tabName}
                    </Button>)}
                </div>
            ))}
            </div>
            {currentTab === TABS[0] ? (
                <AdviceTable data={currentTransactionsData} onClick={onAdviceConfirm} loadingNewAdvice={loadingNewAdvice} statementUrl={currentPortfolio.advice[0]?.url} />
            ) : (
                <PortfolioTable columns={visibleColumns} data={currentData} />
            )}
        </>
    )
};

export default PortfolioTabs;