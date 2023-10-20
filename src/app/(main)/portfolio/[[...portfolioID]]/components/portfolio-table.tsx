"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useEffect, useState } from "react";

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
} from "@/components/ui/table"

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { BiLockAlt, BiLockOpenAlt } from "react-icons/bi";
import { LuGlobe2, LuChevronsUpDown } from "react-icons/lu";
import { GiAustralia } from "react-icons/gi";

import { useGlobalContext } from "@/context/GlobalState";

//define format for currencies


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

interface PortfolioTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export default function PortfolioTable<TData, TValue>({
    columns,
    data
}: PortfolioTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
          sorting,
        },
    })

    return (
        <Table>
            <TableHeader>
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
                table.getRowModel().rows.map((row) => (
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
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    No holdings.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
    );
}
