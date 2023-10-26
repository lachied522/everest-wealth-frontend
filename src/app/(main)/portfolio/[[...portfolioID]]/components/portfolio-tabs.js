"use client";
import { useEffect, useState, forwardRef } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { useUniverseContext } from "@/context/UniverseState";

import { addStockInfoToPortfolio } from "./portfolio-page";

import AdviceTable from "@/components/advice-table";
import PortfolioTable from "./portfolio-table";
import { columns as portfolioColumns } from "./portfolio-columns";
import { columns as adviceColumns } from "@/components/advice-table-columns";

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
            "totalCost",
            "value",
            "totalProfit",
            "sector",
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



export function addInfoToTransactions(transactions, universeDataMap) {
    if (!(transactions?.length > 0)) return [];

    const newArray = transactions.map(({ symbol, units }) => {
        if (!universeDataMap.has(symbol)) return { symbol, units };
        const name = universeDataMap.get(symbol).name;
        const price = universeDataMap.get(symbol).last_price;

        const value = (price * units).toFixed(2);
        const transaction = units > 0? "BUY" : "SELL";

        return { symbol, units, name, transaction, value};
    });

    return newArray;
}

const AdviceNotification = ({ transactions }) => {
    if (!(transactions?.length > 0)) return null;

    return (
        <div className="absolute flex top-0 right-0 items-center justify-center rounded-full h-4 w-4 text-xs bg-red-300 text-white">
            {transactions.length}
        </div>
    )
}

const PortfolioTabs = ({ portfolioData, adviceData, onAdviceConfirm, loadingNewData, loadingNewAdvice }) => {
    const { universeDataMap } = useUniverseContext();
    const [currentData, setCurrentData] = useState([]);
    const [currentTransactionsData, setCurrentTransactionsData] = useState([]);
    const [currentTab, setCurrentTab] = useState(TABS[1]); //keeps track of current tab, defaults to 'overview'
    const [visibleColumns, setVisibleColumns] = useState([]);

    useEffect(() => {
        if (portfolioData && universeDataMap) setCurrentData(addStockInfoToPortfolio(portfolioData?.holdings, universeDataMap));
    }, [portfolioData]);

    useEffect(() => {
        if (adviceData && universeDataMap) setCurrentTransactionsData(addInfoToTransactions(adviceData?.transactions, universeDataMap));
    }, [adviceData]);

    useEffect(() => {
        // update visible columns on tab change
        let newColumns = portfolioColumns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey));
        setVisibleColumns(newColumns);
    }, [currentTab]);

    useEffect(() => {
        // switch to 'overview' tab
        if (loadingNewData) setCurrentTab(TABS[1]);
    }, [loadingNewData]);

    useEffect(() => {
        // switch to 'recommendations' tab
        if (loadingNewAdvice) setCurrentTab(TABS[0]);
    }, [loadingNewAdvice]);

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
                <AdviceTable columns={adviceColumns} data={currentTransactionsData} onClick={onAdviceConfirm} loadingNewAdvice={loadingNewAdvice} />
            ) : (
                <PortfolioTable columns={visibleColumns} data={currentData} />
            )}
        </>
    )
};

export default PortfolioTabs;