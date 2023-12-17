"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { LuFileText, LuLoader2 } from "react-icons/lu";

import { useGlobalContext } from "@/context/GlobalState";
import { usePortfolioContext } from "../../context/PortfolioState";
import { columns } from "./recommendations-table-columns";
import { Tables } from "@/types/supabase";
import { AdviceData, Transaction } from "@/types/types";
import Link from "next/link";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function populateTransactionsColumns(transactions: Transaction[]) {
    // populate columns
    if (!(transactions?.length > 0)) return [];

    const populatedTransactions = transactions.map((obj) => {
        const price = obj.price || 0;
        const units = obj.units || 0;
        const value = (price * units).toFixed(2);
        const net = obj.brokerage? (price * units - obj.brokerage).toFixed(2): value;

        const transaction = units > 0? "Buy" : "Sell";

        return { ...obj, transaction, value, net};
    });

    return populatedTransactions;
}

interface RecommendationsTableProps {
    setAdviceNotification: (value: number) => void
}

export default function RecommendationsTable<TData>({
    setAdviceNotification,
}:  RecommendationsTableProps) {
    const { updatePortfolio, setAdvice } = useGlobalContext();
    const { currentPortfolio, loadingNewAdvice } = usePortfolioContext();
    const [data, setData] = useState<AdviceData | null>(null);
    const [sorting, setSorting] = useState<SortingState>([]);
    const router = useRouter();

    useEffect(() => {
        if (currentPortfolio)  {
            const advice = currentPortfolio.advice[0];

            if (advice && advice.transactions && !(advice.status==="actioned")) {
                const transactions = populateTransactionsColumns(advice.transactions);
                setData({
                    ...advice,
                    transactions,
                });
                setAdviceNotification(transactions.length);
            } else {
                setData(null);
                // remove advice notification
                setAdviceNotification(0);
            }
        }
    }, [currentPortfolio, setAdviceNotification]);

    const gross = useMemo(() => {
        if (!data) return 0;
        return data.transactions?.reduce((acc, obj) => acc + (Number(obj["units" as keyof typeof obj] || 0) * Number(obj["price" as keyof typeof obj] || 0)), 0)
    }, [data]);
    
    const brokerage = useMemo(() => {
        if (!data) return 0;
        return data.transactions?.reduce((acc, obj) => acc + Number(obj["brokerage" as keyof typeof obj] || 0), 0)
    }, [data]);

    const table = useReactTable({
        data: data?.transactions || [],
        columns: columns as ColumnDef<TData | any>[],
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        },
    })

    const onAdviceAction = useCallback((action: string) => {
        if (!['confirm', 'dismiss'].includes(action)) return;

        fetch('/api/action-advice', {
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
        .then(({ success, data }: { success: boolean, data: Tables<'holdings'>[] }) => {
            if (!success) throw new Error('Api error');

            if (data.length > 0) {
                const updatedSymbols = Array.from(data, (obj) => obj.symbol);

                // api route only returns updated holdings, combine updated and existing holdings for new portfolio
                const newHoldings = [
                        ...currentPortfolio.holdings.filter((holding: Tables<'holdings'>) => !updatedSymbols.includes(holding.symbol)),
                        ...data,
                    ];

                updatePortfolio(currentPortfolio.id, newHoldings);
            }

            // switch to 'Overview' tab
            router.push(`/portfolio/${currentPortfolio.id}?tab=Overview`);

            // update advice status
            setAdvice(
                currentPortfolio.id,
                {
                    ...currentPortfolio.advice[0],
                    status: action==='confirm'? 'actioned': 'dismissed',
                }
            );
        })
        .catch(err => console.log(err));
    }, [currentPortfolio, updatePortfolio, setAdvice, router]);


    // define loading state
    if (loadingNewAdvice) {
        return (
            <div className="rounded-md bg-white border">
                <Table>
                    <TableHeader className="bg-slate-100/50 transition-none">
                    {table?.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-48 text-center">
                                <div className="w-full flex items-center justify-center">
                                    <LuLoader2 className="animate-spin" size={50}/>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className="rounded-md bg-white border">
            <Table>
                <TableHeader className="bg-slate-100/50 transition-none">
                {table?.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                        return (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                                )}
                        </TableHead>
                        )
                    })}
                    </TableRow>
                ))}
                </TableHeader>
                <TableBody>
                {data && table.getRowModel().rows?.length ? (
                    <>
                        {table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="items-center">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={columns.length} className="p-6 bg-slate-200/50 transition-none hover:bg-slate-200/50">
                                <div className="flex justify-end items-end">             
                                    <div className="flex flex-col items-end gap-6">
                                        <div className="grid gap-4 auto-rows-auto grid-cols-[1fr_0.75fr] items-center justify-items-stretch border-b-slate-300 border-b border-solid pb-4 my-6">
                                            <div>
                                                Est. Brokerage
                                            </div>
                                            <div className="text-right">
                                                {USDollar.format(brokerage)}
                                            </div>
                                            <div>
                                                Gross
                                            </div>
                                            <div className="text-right">
                                                {USDollar.format(gross)}
                                            </div>
                                            <div>
                                                Net
                                            </div>
                                            <div className="text-right">
                                                {USDollar.format(gross - brokerage)}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-6">  
                                            {data.status==='generating' ? (
                                            <Button variant="ghost" disabled className="flex items-center gap-2">
                                                <LuLoader2 className="animate-spin" size={25}/>
                                                Generating statement...
                                            </Button>
                                            ) : (
                                            <a href={data.url || ""} target="_blank" className='h-10 px-4 py-2 flex items-center gap-2 no-underline font-medium text-slate-700 group-hover:text-blue-600 relative'>
                                                <LuFileText size={30} className="absolute left-[-36px]"/>
                                                View Document
                                            </a>
                                            )}
                                            <Button variant="secondary" onClick={() => onAdviceAction('dismiss')}>
                                                Dismiss Changes
                                            </Button>
                                            <Button onClick={() => onAdviceAction('confirm')}>
                                                Make These Changes
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </>
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No current recommendations. <Link href={`/advice/${currentPortfolio.id}`}>View previous Advice.</Link>
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    );
}
