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

import type { Tables } from "@/types/supabase";

function populateTransactionsData(transactions: Tables<'recom_transactions'>[]) {
    if (!(transactions.length > 0)) return [];
  
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

interface AdviceTableProps {
    transactions: Tables<'recom_transactions'>[]
}

export default function AdviceTable<TData>({
    transactions,
}:  AdviceTableProps) {
    const table = useReactTable({
        data: populateTransactionsData(transactions),
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
