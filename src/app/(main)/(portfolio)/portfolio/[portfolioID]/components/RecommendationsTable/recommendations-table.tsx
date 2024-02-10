"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
    ColumnDef,
    RowSelectionState,
    flexRender,
    getCoreRowModel,
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

import { useGlobalContext, GlobalState } from "@/context/GlobalState";
import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

import { columns } from "./recommendations-table-columns";

import type { Tables } from "@/types/supabase";
import type { PopulatedHolding } from "@/types/types";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function populateTransactionsData(transactions: Tables<'recom_transactions'>[]) {
    return transactions.map((obj) => {
        const price = obj.price || 0;
        const units = obj.units || 0;
        const value = (price * units).toFixed(2);
        const net = obj.brokerage? (price * units - obj.brokerage).toFixed(2): value;

        const direction = units > 0? "Buy" : "Sell";

        return { ...obj, direction, value, net};
    });
}

export default function RecommendationsTable<TData>() {
    const { currentPortfolio, setAdvice, updateHoldings } = usePortfolioContext() as PortfolioState;
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const router = useRouter();

    if (!currentPortfolio) throw new Error('currentPortfolio undefined');

    const populatedData = useMemo(() => {
        const advice = currentPortfolio.advice[0];
        if (advice && !(advice.status==="actioned")) {
            return {
                ...advice,
                recom_transactions: populateTransactionsData(advice.recom_transactions),
            };
        }
        return;
    }, [currentPortfolio.advice]);

    useEffect(() => {
        // reset row selection on change in data
        setRowSelection({});
    }, [populatedData]);

    const table = useReactTable({
        data: populatedData? populatedData.recom_transactions: [],
        columns: columns as ColumnDef<TData | any>[],
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
          rowSelection,
        },
    });

    const selectedData: ReturnType<typeof populateTransactionsData> = useMemo(() => {
        const data = table.getFilteredSelectedRowModel().rows.map((row) => row.original);
        // if none selected, return every row
        if (data.length) return data;
        return table.getRowModel().rows.map((row) => row.original);
    }, [table, rowSelection]); // this doesn't seem to work unless rowSelection is a dependency

    const updatePortfolio = useCallback((data: PopulatedHolding[]) => {
        // api route only returns updated holdings, combine updated and existing holdings for new portfolio
        const updatedSymbols = Array.from(data, (obj) => obj.symbol);
        const newHoldings = [
            ...currentPortfolio.holdings.filter((holding: Tables<'holdings'>) => !updatedSymbols.includes(holding.symbol)),
            ...data,
        ];
        updateHoldings(newHoldings);
    }, [currentPortfolio.holdings, updateHoldings]);

    const navigateToOverview = useCallback(() => {
        // switch to 'Overview' tab
        router.push(`/portfolio/${currentPortfolio.id}?tab=overview`);
    }, [router, currentPortfolio.id]);

    const setAdviceStatus = useCallback((status: string) => {
        setAdvice({
            ...currentPortfolio.advice[0],
            status,
        })
    }, [currentPortfolio.advice, setAdvice]);

    const onAdviceAction = useCallback((action: 'confirm'|'dismiss') => {
        const data = action==='confirm'? selectedData: [];
        
        fetch('/api/action-advice', {
            method: "POST",
            body: JSON.stringify({
                data,
                advice_id: populatedData!.id,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        .then((res) => res.json())
        .then(({ data }: { data: PopulatedHolding[] }) => {
            if (data.length > 0) updatePortfolio(data);
            // switch back to overview tab
            navigateToOverview();
            // update advice status
            setAdviceStatus('actioned');
        })
        .catch(err => console.log(err));
    }, [populatedData, selectedData, updatePortfolio, navigateToOverview, setAdviceStatus]);

    const gross = useMemo(() => {
        if (!selectedData.length) return 0;
        return selectedData.reduce((acc, obj) => acc + (Number(obj["units" as keyof typeof obj] || 0) * Number(obj["price" as keyof typeof obj] || 0)), 0)
    }, [selectedData]);
    
    const brokerage = useMemo(() => {
        if (!selectedData.length) return 0;
        return selectedData.reduce((acc, obj) => acc + Number(obj["brokerage" as keyof typeof obj] || 0), 0)
    }, [selectedData]);

    return (
        <>
            {populatedData ? (
            <>
                <div className="flex justify-between mb-3">
                    {populatedData.status==='generating' ? (
                    <Button variant="ghost" disabled className="flex items-center gap-2">
                        <LuLoader2 className="animate-spin" size={25}/>
                        Generating advice...
                    </Button>
                    ) : (
                    <a href={populatedData.url || ""} target="_blank" className="h-10 px-4 py-2 flex items-center no-underline font-medium text-slate-700 group-hover:text-blue-600">
                        <LuFileText size={30} className="mr-2" />
                        Statement of Advice
                    </a>
                    )}
                    <div className="flex items-start gap-6">
                        <Button
                            variant="secondary"
                            disabled={populatedData.status==='generating'}
                            onClick={() => onAdviceAction('dismiss')}
                        >
                            Dismiss Changes
                        </Button>
                        {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                        <Button
                            disabled={populatedData.status==='generating'}
                            onClick={() => onAdviceAction('confirm')}
                        >
                            Make {table.getFilteredSelectedRowModel().rows.length} Changes
                        </Button>
                        ) : (
                        <Button
                            disabled={populatedData.status==='generating'}
                            onClick={() => onAdviceAction('confirm')}
                        >
                            Make All Changes
                        </Button>
                        )}
                    </div>
                </div>
                <div className="rounded-md bg-white border">
                    <Table>
                        <TableHeader className="bg-slate-100/50 transition-none">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                <TableHead key={header.id} className="text-center">
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
                            {table.getRowModel().rows.length > 0 ? (
                            <>
                                {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-center">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    ))}
                                </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="p-6 bg-slate-200/50 transition-none hover:bg-slate-200/50">
                                        <div className="flex justify-end items-end">             
                                            <div className="flex flex-col items-end gap-6">
                                                <div className="grid gap-4 auto-rows-auto grid-cols-[1fr_0.75fr] items-center justify-items-stretch my-6">
                                                    <div>
                                                        Est. Brokerage
                                                    </div>
                                                    <div className="text-slate-800 text-right">
                                                        {USDollar.format(brokerage)}
                                                    </div>
                                                    <div>
                                                        Gross
                                                    </div>
                                                    <div className="text-slate-800 text-right">
                                                        {USDollar.format(gross)}
                                                    </div>
                                                    <div>
                                                        Net
                                                    </div>
                                                    <div className="text-slate-800 text-right">
                                                        {USDollar.format(gross - brokerage)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </>
                            ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center">
                                    <div className="w-full flex items-center justify-center text-base">
                                        Nothing here yet.
                                    </div>
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </>
            ) : (
            <div className="ml-2">
                We have no recommendations at the moment. Check back in later or <Link href={`/advice/${currentPortfolio.id}`} className="text-blue-600 underline">view previous Advice.</Link>
            </div>
            )}
        </>
    );
}
