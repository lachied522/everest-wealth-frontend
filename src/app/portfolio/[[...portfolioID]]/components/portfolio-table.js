"use client";
import { useEffect, useState } from "react";
import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";
import { LuGlobe2 } from "react-icons/lu";
import { GiAustralia } from "react-icons/gi";

import { useGlobalContext } from "@/context/GlobalState";

import styles from "./portfolio-table.module.css";

//define format for currencies
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//define map for column formatting and data
const COLUMN_MAP = {
    "Symbol": {
        dataName: "symbol",
        format: "upper",
    },
    "Name": {
        dataName: "name",
        format: "upper",
    },
    "Cost": {
        dataName: "totalCost",
        format: "dollar",
    },
    "Value": {
        dataName: "value",
        format: "dollar",
    },
    "Profit": {
        dataName: "totalProfit",
        format: "dollar",
    },
    "Sector": {
        name: "Sector",
        dataName: "sector",
        format: "lower",
    },
    "Yield": {
        name: "Yield",
        dataName: "div_yield",
        format: "percent",
    }
}

//define tabs and columns to display
const TABS = [
    {
        tabName: "Overview",
        columns: [
            "Symbol",
            "Name",
            "Cost",
            "Value",
            "Profit",
            "Sector",
        ]
    },
    {
        tabName: "Income",
        columns: [
            "Symbol",
            "Name",
            "Cost",
            "Value",
            "Profit",
            "Yield",
        ]
    }
]

function addStockInfoToPortfolio (portfolioData, stockInfoMap) {
    if (!portfolioData) return;

    //calculate total value of portfolio for weight calculations
    const totalValue = portfolioData.reduce((acc, obj) => acc + parseFloat(obj.value), 0);

    const newArray = portfolioData.map(({ symbol, units, cost }) => {
        if (!stockInfoMap.has(symbol)) return { symbol, units, cost };
        const price = stockInfoMap.get(symbol).last_price;

        const value = price * units;
        const weight =  value / totalValue;
        const totalCost = cost? cost * units: 0;
        const totalProfit = (cost? (price - cost): price) * units;

        return { symbol, units, cost, value, weight, price, totalCost, totalProfit, ...stockInfoMap.get(symbol) };
    });

    return newArray;
}

const ColumnHeader = ({ name, index, sort, sortPortfolio }) => {
    const { sortCol, descending } = sort;

    const onClick = () => {
        sortPortfolio(index);
    }

    return (
        <div 
            className="table-column-header"
            onClick={onClick}
        >
            <div className={"text-100 medium" + (sortCol===index? " color-neutral-700": "")}>{name.toUpperCase()}</div>
            <div className="line-rounded-icon table-sort-icon"></div>
        </div>
    )
}

const TableRow = ({ data, cols, toggleHoldingLock }) => {
    const onLockClick = () => {
        toggleHoldingLock({
            locked: !data.locked,
            symbol: data.symbol,
        });
    }

    return (
        <div className="portfolio-table-row">
            <div className="table-item">
                <div className="flex align-center gap-column-12px">
                    {data.domestic? <GiAustralia />: <LuGlobe2 />}
                    <div onClick={onLockClick}>{data.locked? <BiLockAlt />: <BiLockOpenAlt />}</div>
                </div>
            </div>
            {cols.map((col) => {
                const { dataName, format }= COLUMN_MAP[col];
                let v = data[dataName];
                
                if (format==="upper") {
                    v = v?.toUpperCase();
                } else if (format==="dollar") {
                    v = USDollar.format(v);
                } else if (format==="percent") {
                    v = v? parseFloat(100*v).toFixed(2) + "%": "0%";
                }
                
                return (
                    <div className="table-item" key={col}>
                        <div>{v}</div>
                    </div>
                    )
            })}
            <div className="table-item last">
                <div className="flex align-center">
                </div>
            </div>
        </div>
    );
}

export default function PortfolioTable({ portfolioID, data }) {
    const { universeData, updatePortfolio } = useGlobalContext(); //raw portfolio data
    const [dataArray, setDataArray] = useState(data); //array that determines appearance of portfolio table
    const [currentTab, setCurrentTab] = useState(TABS[0]); //keeps track of current tab
    const [sort, setSort] = useState({
        sortCol: 0,
        descending: true,
    });
    const [totalValue, setTotalValue] = useState(0);

    //create new map for populating portfolio with stock info
    const stockInfoMap = new Map();
    universeData.forEach(stock => {
        stockInfoMap.set(stock.symbol, stock);
    });

    const sortPortfolio = (index) => {
        if (!data || data?.length === 0) return;
        const dataName = COLUMN_MAP[currentTab.columns[index]].dataName;
        const newArray = data?.sort(function (a, b) {
            const valueA = a[dataName] || "";
            const valueB = b[dataName] || "";
            
            //check if value is number
            if (parseFloat(valueA)) {
                return valueB - valueA;
            }
        
            return valueA.toString().localeCompare(valueB.toString());
        });
        

        if (sort.sortCol===index && sort.descending) {
            newArray.reverse();
            setSort({
                sortCol: index,
                descending: false,
            });
        } else {
            setSort({
                sortCol: index,
                descending: true,
            });
        }

        setDataArray(newArray);
    }

    const toggleHoldingLock = ({ symbol, locked }) => {
        const newPortfolio = [...data]; //create copy of portfolio data
        const index = newPortfolio.findIndex((obj) => obj.symbol === symbol);
        
        newPortfolio[index].locked = locked;

        updatePortfolio(portfolioID, newPortfolio);
    }

    useEffect(() => {
        //set data array
        setDataArray(addStockInfoToPortfolio(data, stockInfoMap));
        //set total portfolio value
        const newValue = data?.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
        setTotalValue(newValue || 0);
    }, [data]);

    return (
        <div className="w-tabs">
            <div className="portfolio-tab-menu w-tab-menu">
            {TABS.map((tab) => (
            <button
                className={"btn-primary small w-inline-block w-tab-link" + (tab===currentTab? " w--current": "")}
                key={tab.tabName}
                onClick={() => {setCurrentTab(tab)}}
            >
                <div>{tab.tabName}</div>
            </button>
            ))}
            </div>
            <div className="portfolio-tab-content w-tab-content">
            <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
            <div
                data-w-id="281f1de6-6d74-81d3-48d1-dc46a9ec688a"
                className="portfolio-table"
            >
                <div className="portfolio-table-top-section">
                <div className="text-300 medium color-neutral-800">
                    OVERVIEW
                </div>
                <div
                    id="w-node-_14b86d06-d1f9-96aa-7488-aa61ceda5d65-2fdc3ff5"
                    className="flex align-center"
                >
                    <div className="flex mg-right-12px">
                    </div>
                </div>
                </div>
                <div className="portfolio-table-row header">
                    {currentTab.columns.map((col, index) => (
                        <ColumnHeader
                            key={index}
                            index={index}
                            name={col}
                            sort={sort}
                            sortPortfolio={sortPortfolio}
                        />
                    ))}
                </div>
                {dataArray.map((p, index) => (
                    <TableRow 
                        key={index}
                        data={p}
                        cols={currentTab.columns}
                        toggleHoldingLock={toggleHoldingLock}
                    />
                ))}
                {dataArray.length === 0 && (
                    <div className="portfolio-table-empty-container">
                        <div className="text-300">No Holdings</div>
                    </div>
                )}
                <div className="portfolio-table-summary">
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2bc4-2fdc3ff5"
                    className="table-item"
                >
                    <div className="table-item-mobile-caption">
                    <div className="text-100 medium text-uppercase">
                        Invoice ID
                    </div>
                    </div>
                    <div className="flex align-center">
                    <div className="stock-data symbol mg-left-30px">
                        TOTAL
                    </div>
                    </div>
                </div>
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2bdd-2fdc3ff5"
                    className="table-item"
                >
                    <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2be1-2fdc3ff5"
                    className="stock-data cost"
                    >
                    $10,000
                    </div>
                </div>
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2be3-2fdc3ff5"
                    className="table-item"
                >
                    <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2be7-2fdc3ff5"
                    className="stock-data value"
                    >
                    {USDollar.format(totalValue)}
                    </div>
                </div>
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2be9-2fdc3ff5"
                    className="table-item"
                >
                    <div className="stock-data profit">$11,250</div>
                </div>
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2bef-2fdc3ff5"
                    className="table-item"
                >
                    <div className="table-item-mobile-caption">
                    <div className="text-100 medium text-uppercase">
                        Status
                    </div>
                    </div>
                </div>
                <div
                    id="w-node-_5a04c2e0-f325-c94c-e89c-6b0818aa2bf5-2fdc3ff5"
                    className="table-item last"
                >
                    <div className="table-item-mobile-caption">
                    <div className="text-100 medium text-uppercase">
                        Action
                    </div>
                    </div>
                </div>
                </div>
            </div>
                <div
                data-w-id="55323117-e253-3109-3439-934d13b0e5d4"
                className="grid-2-columns _2-col-mbl mg-top-16px"
                >
                <div className="flex">
                    <div className="text-200 medium color-accent-1">1 - 10 </div>
                    <div className="text-200">of 640</div>
                </div>
                <div
                    id="w-node-_221bdebd-e5b8-afcf-ad5e-51ba74255f52-2fdc3ff5"
                    className="flex"
                >
                    <a
                    href="#"
                    className="btn-circle-secondary table-button mg-right-6px w-inline-block"
                    >
                    <div className="line-rounded-icon"></div>
                    </a>
                    <a
                    href="#"
                    className="btn-circle-secondary table-button w-inline-block"
                    >
                    <div className="line-rounded-icon"></div>
                    </a>
                </div>
                </div>
            </div>
            </div>
        </div>
  );
}
