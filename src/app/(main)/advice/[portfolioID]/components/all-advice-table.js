"use client";
import { useState, useEffect } from 'react';

import { LuFileText, LuChevronRight, LuChevronDown } from "react-icons/lu";

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
import { columns as adviceColumns } from "./advice-table-columns";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const TableSubRow = ({ data }) => {
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
                    <a href={data?.url} target="_blank" className='flex justify-center text-slate-700 hover:text-blue-600'>
                        <LuFileText size={30} />
                    </a>
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
                    <AdviceTable data={data} />
                </TableCell>
            </TableRow>
            )}
        </>
    )
}

const AllAdviceTable = ({ jsonData }) => {
    const data = JSON.parse(jsonData);
    
    return (
        <div className="rounded-md bg-white border">
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
                    {data?.map((advice) => (
                        <TableSubRow 
                            key={advice.id}
                            data={advice}
                        />
                    ))}
            </TableBody>
            </Table>
        </div>
    )

}


export default AllAdviceTable;