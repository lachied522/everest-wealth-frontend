"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/

import {
    ColumnDef,
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

import { columns } from "./advice-table-columns";

import type { Transaction } from "@/types/types";

interface AdviceTableProps {
    transactions: Transaction[]
}

export default function AdviceTable<TData>({
    transactions,
}:  AdviceTableProps) {
    const table = useReactTable({
        data: transactions,
        columns: columns as ColumnDef<TData | any>[],
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

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
                </TableBody>
            </Table>
        </div>
    );
}
