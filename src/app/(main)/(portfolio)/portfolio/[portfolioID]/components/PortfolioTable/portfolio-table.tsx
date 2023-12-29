"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useState, useEffect } from "react";

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

import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/components/lib/utils";

import { LuStar } from "react-icons/lu";

import { useGlobalContext, GlobalState } from "@/context/GlobalState";
import { usePortfolioContext, PortfolioState } from "@/context/portfolio/PortfolioState";

import type { PopulatedHolding } from "@/types/types";

const Star = ({ selected, onClick } : { selected: boolean, onClick: () => void }) => {
    return (
      <LuStar 
        size={20}
        onClick={onClick}
        className={cn(
            'cursor-pointer hover:scale-105',
            selected && 'fill-yellow-400 text-yellow-400'
        )}
      />
    )
}

interface PortfolioTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export default function PortfolioTable<TData, TValue>({
    columns,
}: PortfolioTableProps<TData, TValue>) {
    const { toggleFavourite } = useGlobalContext() as GlobalState;
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const [data, setData] = useState<TData[] | null>(null);
    const [sorting, setSorting] = useState<SortingState>([])

    useEffect(() => {
        if (currentPortfolio)  {
            setData(currentPortfolio.holdings as TData[]);
        } else {
            setData(null);
        }
    }, [currentPortfolio]);

    const table = useReactTable({
        data: data || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        },
    })

    return (
        <div className="rounded-md bg-white border">
            <Table>
                <TableHeader className="bg-slate-100/50 transition-none">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        <TableHead><div className="w-[24px]"/>{/* add spacer for 'locked' column */}</TableHead>
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
                {data ? (
                    <>
                    {data.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            <TableCell className="items-center">
                                <Star selected={Boolean(row.original['locked' as keyof TData])} onClick={() => toggleFavourite(row.original['id' as keyof TData] as PopulatedHolding['id'])}/>
                            </TableCell>
                            {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="items-center">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No holdings.
                            </TableCell>
                        </TableRow>
                    )}
                    </>
                ) : (
                    Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell><div className="w-[24px]"/>{/* add spacer for 'locked' column */}</TableCell>
                            {columns.map((_, index) => (
                                <TableCell key={index}>
                                    <Skeleton className="w-full h-[24px]"/>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                )}
                </TableBody>
            </Table>
        </div>
    );
}
