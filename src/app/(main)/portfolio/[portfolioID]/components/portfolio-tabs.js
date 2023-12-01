"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { revalidatePath } from 'next/cache';

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import AdviceTable from "@/components/advice-table";
import PortfolioTable from "./portfolio-table";
import { columns as portfolioColumns } from "./portfolio-columns";
import { useGlobalContext } from "@/context/GlobalState";

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

async function addStockInfoToPortfolio(holdingsData) {
    if (!holdingsData) return [];
  
    const newArray = await Promise.all(holdingsData.map(async ({ id, symbol, units, cost, locked }) => {
        const params = new URLSearchParams({ s: symbol });
        const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
    
        if (!data) return { symbol, units, cost };

        const price = data['last_price'];
        const value = (price * units).toFixed(2);
        //const weight =  (100*(value / totalValue)).toFixed(2);
        const totalCost = cost? (cost * units).toFixed(2): 0;
        const totalProfit = ((cost? (price - cost): price) * units).toFixed(2);
        // convert string to bool
        const domestic = data['domestic']==="True";

        return { ...data, id, symbol, units, cost, locked, value, price, totalCost, totalProfit, domestic };
    }));

    // calculate total value of portfolio for weight calculations
    const totalValue = newArray.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
    
    const newArrayWithWeight = newArray.map((holding) => ({
        ...holding,
        weight: holding.value / totalValue
    }));

    return newArrayWithWeight;
}

async function addInfoToTransactions(transactions) {
    if (!(transactions.length > 0)) return [];

    const newArray = await Promise.all(transactions.map(async ({ symbol, units, brokerage, price }) => {
        const params = new URLSearchParams({ s: symbol });
        const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());

        if (!data) return { symbol, units, brokerage, price };

        const value = (price * units).toFixed(2);
        const net = brokerage? (price * units - brokerage).toFixed(2): value;

        const transaction = units > 0? "Buy" : "Sell";

        const name = data['name'];

        return { symbol, units, brokerage, price, name, transaction, value, net};
    }));

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

const PortfolioTabs = ({ loadingNewAdvice }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentPortfolio, updatePortfolio } = useGlobalContext();
    const [currentTab, setCurrentTab] = useState(TABS[1]); // keeps track of current tab, defaults to 'overview'
    const [portfolioData, setPortfolioData] = useState(null); // set to null while data is fetching
    const [adviceData, setAdviceData] = useState(null); 

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
        let active = true; // keep track of whether component is active
        if (currentPortfolio) getData();
        return () => {
            active = false;
        }

        async function getData() {
            const data = await addStockInfoToPortfolio(currentPortfolio.holdings);
            if (active) setPortfolioData(data);
        }
    }, [currentPortfolio.holdings]);

    useEffect(() => {
        let active = true; // keep track of whether component is active
        if (currentPortfolio) getData();
        return () => {
            active = false;
        }

        async function getData() {
            const advice = currentPortfolio.advice[0];
            if (advice && advice.transactions && !(advice.status==="actioned")) {
                const transactions = await addInfoToTransactions(advice.transactions);
                if (active) setAdviceData({
                    ...advice,
                    transactions,
                });
            }
        }
    }, [currentPortfolio]);

    const visibleColumns = useMemo(() => {
        // update visible columns on tab change
        return portfolioColumns.filter((column) => currentTab.visibleColumns.includes(column.accessorKey));
    }, [currentTab]);

    const onTabClick = (index) => {
        router.push(`/portfolio/${currentPortfolio.id}?tab=${TABS[index].tabName}`);
    }

    const onAdviceConfirm = async () => {
        const newHoldings = await fetch('/api/confirm-advice', {
            method: "POST",
            body: JSON.stringify({
                advice: currentPortfolio.advice[0],
                action,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then(res => res.json())
        .then(updatedHoldings => {
            const updatedSymbols = Array.from(updatedHoldings, (obj) => { return obj.symbol });
            return [
                    ...currentPortfolio.holdings.filter((holding) => !updatedSymbols.includes(holding.symbol)),
                    ...updatedHoldings,
                ];
        })
        .catch(err => console.log(err));

        await updatePortfolio(currentPortfolio.id, newHoldings);

        setCurrentTab(TABS[1]);

        // toggleAdviceActioned(currentPortfolio.id);

    }

    return (
        <>
            <div className="flex gap-3 mb-4 px-3">
            {TABS.map((tab, index) => (
                <div key={tab.tabName} className="relative">
                    {tab.tabName==='Recommendations' ? (
                    <>
                        <AdviceNotification transactions={adviceData.transactions}/>
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
                <AdviceTable 
                    data={adviceData} 
                    onAdviceAction={onAdviceAction} 
                    loadingNewAdvice={loadingNewAdvice} 
                    statementUrl={currentPortfolio.advice[0]?.url} 
                />
            ) : (
                <PortfolioTable columns={visibleColumns} data={portfolioData} />
            )}
        </>
    )
};

export default PortfolioTabs;