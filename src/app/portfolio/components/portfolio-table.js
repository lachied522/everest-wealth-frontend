"use client";
import { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/GlobalState";

import styles from "./portfolio-table.module.css";

//define format for currencies
const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//define columns
const columns = [
    {
        name: "Symbol",
        dataName: "symbol"
    },
    {
        name: "Name",
        dataName: "name"
    },
    {
        name: "Cost",
        dataName: "cost"
    },
    {
        name: "Value",
        dataName: "value"
    },
    {
        name: "Profit",
        dataName: "profit"
    },
    {
        name: "Sector",
        dataName: "sector"
    }
]

const ColumnHeader = ({ name, index, sort, setSort }) => {
    const { sortCol, descending } = sort;

    const onClick = () => {
        setSort({
            sortCol: index,
            descending: sortCol===index? !descending: false,
        });
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

const TableRow = ({ data, deleteHolding }) => {
    const symbol = data.symbol?.toUpperCase();
    const name = data.name;
    const cost = USDollar.format(data.cost? data.cost*data.units: 0);
    const value = USDollar.format(data.value);
    const sector = data.sector;

    const profit =  USDollar.format(data.value - (data.cost? data.cost*data.units: 0));

    const onDeleteClick = () => {
        deleteHolding(data);
    }

    return (
        <div className="portfolio-table-row">
            <div className="table-item">
                <div className="stock-data symbol">{symbol}</div>
            </div>
            <div className="table-item">
                <div>{name}</div>
            </div>
            <div className="table-item">
                <div className="stock-data cost">{cost}</div>
            </div>
            <div className="table-item">
                <div className="stock-data value">{value}</div>
            </div>
            <div className="table-item">
                <div className="stock-data profit">{profit}</div>
            </div>
            <div className="table-item">
                <div className="stock-data sector">{sector}</div>
            </div>
            <div className="table-item last">
                <div className="flex align-center">
                <div className="custom-icon view-icon mg-right-8px"></div>
                <div className="custom-icon edit-icon mg-right-8px"></div>
                <div 
                    className="custom-icon delete-icon"
                    onClick={onDeleteClick}
                ></div>
                </div>
            </div>
        </div>
    );
}

export default function PortfolioTable() {
    const { portfolioData, deleteHolding, commitChanges } = useGlobalContext(); //raw portfolio data
    const [dataArray, setDataArray] = useState(portfolioData || []); //array that determines appearance of portfolio table
    const [sort, setSort] = useState({
        sortCol: 0,
        descending: true,
    });
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        //sort portfolio
        if (portfolioData.length === 0) return;
        const { sortCol, descending } = sort;
        const dataName = columns[sortCol].dataName;
        const newArray = portfolioData?.sort(function (a, b) {
            const valueA = a[dataName] || "";
            const valueB = b[dataName] || "";
            
            //check if value is number
            if (parseFloat(valueA)) {
                return valueA - valueB;
            }
        
            return valueA.toString().localeCompare(valueB.toString());
        });
        if (!descending) newArray.reverse();
        setDataArray(newArray);
    }, [portfolioData, sort]);

    useEffect(() => {
        //set total portfolio value
        const newValue = portfolioData?.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
        setTotalValue(newValue || 0);
    }, [portfolioData]);

    return (
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
                {columns.map((col, index) => (
                    <ColumnHeader
                        key={index}
                        name={col.name}
                        index={index}
                        sort={sort}
                        setSort={setSort}
                    />
                ))}
            </div>
            {dataArray.map((data, index) => (
                <TableRow 
                    key={index}
                    data={data}
                    deleteHolding={deleteHolding}
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
  );
}
