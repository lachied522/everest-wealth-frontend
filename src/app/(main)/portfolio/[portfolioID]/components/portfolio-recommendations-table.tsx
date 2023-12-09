"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useMemo, useState } from "react";

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

import { usePortfolioContext } from "../context/PortfolioState";
import { columns } from "./portfolio-recommendations-table-columns";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

interface PortfolioRecommendationsTableProps<TData, TValue> {
    data: {
        transactions: TData[]
        gross: number
        brokerage: number
    }
    statementUrl: string
    onAdviceAction: (action: string) => void
}

export default function PortfolioRecommendationsTable<TData, TValue>({
    data,
    statementUrl,
    onAdviceAction,
}:  PortfolioRecommendationsTableProps<TData, TValue>) {
    const { loadingNewAdvice } = usePortfolioContext();
    const [sorting, setSorting] = useState<SortingState>([]);

    const gross = useMemo(() => {
        if (!data) return 0;
        return data.transactions.reduce((acc, obj) => acc + (Number(obj["units" as keyof typeof obj] || 0) * Number(obj["price" as keyof typeof obj] || 0)), 0)
    }, [data]);
    
    const brokerage = useMemo(() => {
        if (!data) return 0;
        return data.transactions.reduce((acc, obj) => acc + Number(obj["brokerage" as keyof typeof obj] || 0), 0)
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
                {table.getRowModel().rows?.length ? (
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
                                            {!statementUrl ? (
                                            <Button variant="ghost" disabled className="flex items-center gap-2">
                                                <LuLoader2 className="animate-spin" size={25}/>
                                                Generating statement...
                                            </Button>
                                            ) : (
                                            <a href={statementUrl} target="_blank" className='h-10 px-4 py-2 flex items-center gap-2 no-underline font-medium text-slate-700 group-hover:text-blue-600 relative'>
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
                            No current recommendations.
                        </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
    );
}
