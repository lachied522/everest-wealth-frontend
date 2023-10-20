"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { useUniverseContext } from "@/context/UniverseState";

import RecommendationsTable from "@/components/recommendations-table";
import PortfolioTable from "./portfolio-table";
import { columns } from "./portfolio-columns";

//define tabs and columns to display
const TABS = [
    {
        tabName: "Recommendations",
        visibleColumns: []
    },
    {
        tabName: "Overview",
        visibleColumns: [
            'domestic',
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
            'domestic',
            "symbol",
            "name",
            "totalCost",
            "value",
            "totalProfit",
            "div_yield",
        ]
    }
]

function addStockInfoToPortfolio (portfolioData, universeDataMap) {
    if (!portfolioData) return;

    //calculate total value of portfolio for weight calculations
    //const totalValue = portfolioData.reduce((acc, obj) => acc + parseFloat(obj.price * obj.units), 0);

    const newArray = portfolioData.map(({ symbol, units, cost }) => {
        if (!universeDataMap.has(symbol)) return { symbol, units, cost };
        const price = universeDataMap.get(symbol).last_price;

        const value = (price * units).toFixed(2);
        //const weight =  (100*(value / totalValue)).toFixed(2);
        const totalCost = cost? (cost * units).toFixed(2): 0;
        const totalProfit = ((cost? (price - cost): price) * units).toFixed(2);

        return { symbol, units, cost, value, price, totalCost, totalProfit, ...universeDataMap.get(symbol) };
    });
    
    return newArray;
}


export default function PortfolioTabs({ portfolioID, data }) {
    const { universeDataMap } = useUniverseContext();
    const [currentData, setCurrentData] = useState([]);
    const [currentTab, setCurrentTab] = useState(TABS[1]); //keeps track of current tab, defaults to 'overview'
    const [visibleColumns, setVisibleColumns] = useState([]);


    useEffect(() => {
        if (data && universeDataMap) setCurrentData(addStockInfoToPortfolio(data, universeDataMap));
    }, [data]);

    useEffect(() => {
        // update visible columns on tab change
        let newColumns = columns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey));
        setVisibleColumns(newColumns);
    }, [currentTab]);

    return (
        <>
            <div className="portfolio-tab-menu w-tab-menu">
            {TABS.map((tab) => (
                <Button
                    key={tab.tabName}
                    variant="tab"
                    className={cn(
                        tab === currentTab && "underline"
                    )}
                    onClick={() => {setCurrentTab(tab)}}
                >
                    {tab.tabName}
                </Button>
            ))}
            </div>
            {currentTab === TABS[0] ? (
                <RecommendationsTable />
            ) : (
                <PortfolioTable columns={visibleColumns} data={currentData} />
            )}
        </>
    )
}