"use client";
import { useMemo, useState } from 'react';

import { LuFileText, LuChevronRight } from "react-icons/lu";

import { cn } from '@/components/lib/utils';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button';

import AdviceTable from "./advice-table"
import type { AdviceData } from '@/types/types';

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const TableSubRow = ({ data }: { data: AdviceData }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    }

    const date = new Date(data.created_at).toUTCString().slice(5, 16);
    const type = data.type.toUpperCase();

    return (
        <>
            <TableRow className='bg-white transition-none hover:bg-white'>
                <TableCell className='text-center'>
                {data.url ? (
                    <a href={data.url} target="_blank" className='flex justify-center text-slate-700 hover:text-blue-600'>
                        <LuFileText size={30} />
                    </a>
                ) : (
                    // this should never happen as advice with 'finalised' status should always have url
                    <div className='flex justify-center text-slate-700'>
                        <LuFileText size={30} />
                    </div>
                )}
                </TableCell>
                <TableCell className='text-center'>{date}</TableCell>
                <TableCell className='text-center'>{type}</TableCell>
                <TableCell className='text-center'>{USDollar.format(data.value)}</TableCell>
                <TableCell className='text-center'>
                    <Button variant="outline" size="icon" onClick={toggleOpen}>
                        <LuChevronRight className={cn(
                            'duration-300',
                            isOpen && 'rotate-90'
                        )}/>
                    </Button>
                </TableCell>
            </TableRow>
            {isOpen && (
            <TableRow className='bg-white transition-none hover:bg-white p-0'>
                <TableCell colSpan={5} className='p-0'>
                    <AdviceTable transactions={data.transactions} />
                </TableCell>
            </TableRow>
            )}
        </>
    )
}

interface AllAdviceTableProps {
    data?: AdviceData[]
}

export default function AllAdviceTable({ data }: AllAdviceTableProps) {
    const [visibleRows, setVisibleRows] = useState<number>(5)

    const dataLength = useMemo(() => data? data.length: 0, [data])

    return (
        <>
            <div className="rounded-md bg-white border mb-6">
                <Table>
                    <TableHeader className='bg-slate-100/50 transition-none'>
                        <TableRow>
                            <TableHead className='text-center'>Document</TableHead>
                            <TableHead className='text-center'>Date</TableHead>
                            <TableHead className='text-center'>Type</TableHead>
                            <TableHead className='text-center'>Value</TableHead>
                            <TableHead className='text-center'>Expand</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.filter((advice) => advice.transactions.length > 0).slice(0, visibleRows).map((advice) => (
                            <TableSubRow
                                key={advice.id}
                                data={advice}
                            />
                        ))}
                </TableBody>
                </Table>
            </div>
            <div className="w-full flex items-center justify-center p-6">
                <Button
                    variant='ghost'
                    disabled={data? visibleRows >= dataLength: true}
                    onClick={() => setVisibleRows((prevState) => Math.min(prevState + 5, dataLength))}
                >
                    View More
                </Button>
                <Button
                    variant='ghost'
                    disabled={visibleRows - 5 <= 0}
                    onClick={() => setVisibleRows((prevState) => Math.max(prevState - 5, 5))}
                >
                    View Less
                </Button>
            </div>
        </>
    )
}