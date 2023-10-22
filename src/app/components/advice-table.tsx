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
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import { cn } from "@/components/lib/utils";

import { LuFileText, LuLoader2 } from "react-icons/lu";


interface AdviceTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loadingNewAdvice: boolean
    actioned: boolean
    onClick: () => void
}

export default function AdviceTable<TData, TValue>({
    columns,
    data,
    loadingNewAdvice,
    actioned,
    onClick,
}:  AdviceTableProps<TData, TValue>) {
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
                        {!actioned && (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="p-6 bg-slate-200/50 transition-none">
                                <div className="flex justify-end items-end">
                                    <div className="flex items-start gap-6">                
                                        <a href='/statement/123' target="_blank" className='flex items-center gap-2 no-underline font-medium text-slate-700 group-hover:text-blue-600 relative'>
                                            <LuFileText size={30} className="absolute left-[-36px]"/>
                                            View Document
                                        </a>
                                        <div className="flex flex-col items-center">
                                            <div className="grid gap-3 auto-rows-auto grid-cols-[1fr_0.75fr] items-center justify-items-stretch border-b-slate-300 border-b border-solid pb-3 mb-3">
                                                <div>
                                                    Est. Brokerage
                                                </div>
                                                <div className="text-right">
                                                    $10
                                                </div>
                                                <div>
                                                    Gross
                                                </div>
                                                <div className="text-right">
                                                    $100
                                                </div>
                                                <div>
                                                    Net
                                                </div>
                                                <div className="text-right">
                                                    $110
                                                </div>
                                            </div>
                                            <Button onClick={onClick}>
                                                Make These Changes
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                        )}
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
