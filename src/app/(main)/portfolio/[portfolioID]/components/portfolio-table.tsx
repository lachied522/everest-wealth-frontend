"use client";
/* 
 *  docs: https://ui.shadcn.com/docs/components/data-table 
*/
import { useState } from "react";

import {
    ColumnDef,
    Row,
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

import { useGlobalContext } from "@/context/GlobalState";


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
    data: TData[]
}

export default function PortfolioTable<TData, TValue>({
    columns,
    data,
}: PortfolioTableProps<TData, TValue>) {
    const { toggleFavourite } = useGlobalContext()
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

    const RowLoadingState = () => {
        return (
            <TableRow>
                <TableCell><div/></TableCell> {/* add spacer for 'locked' column */}
                {columns.map((_, index) => (
                    <TableCell key={index}>
                        <Skeleton className="w-full h-[24px]"/>
                    </TableCell>
                ))}
            </TableRow>
        );
    }

    return (
        <div className="rounded-md bg-white border">
            <Table>
                <TableHeader className="bg-slate-100/50 transition-none">
                {table?.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        <TableHead><div/></TableHead> {/* add spacer for 'locked' column */}
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
                                <Star selected={Boolean(row.original['locked' as keyof TData])} onClick={() => toggleFavourite(row.original['id' as keyof TData])}/>
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
                        <RowLoadingState key={index}/>
                    ))
                )}
                </TableBody>
            </Table>
        </div>
    );
}
