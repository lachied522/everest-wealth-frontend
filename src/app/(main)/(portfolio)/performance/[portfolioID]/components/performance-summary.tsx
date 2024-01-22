"use client";
import { useMemo } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { usePortfolioContext, PortfolioState } from "@/context/PortfolioState";

import type { TimeSeriesDataPoint } from "@/types/types";

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

interface PerformanceSummaryProps {
    performance: TimeSeriesDataPoint[]
    dividends: TimeSeriesDataPoint[]
}

export default function PerformanceSummaryTable({ performance, dividends }: PerformanceSummaryProps) {
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;

    const totalCapitalGain = useMemo(() => {
        if (currentPortfolio) {
            const totalCost = currentPortfolio.holdings.reduce((acc, obj) => acc + (obj?.cost || 0), 0);
            return currentPortfolio.totalValue - totalCost;
        }
        return 0;
    }, [currentPortfolio]);

    const totalDividends = useMemo(() => {
        return dividends.reduce((acc, obj) => acc + obj.value, 0);
    }, [dividends]);

    return (
        <Table>
            <TableHeader>
                <TableRow className='bg-white transition-none hover:bg-white'>
                    <TableHead>Capital Gain</TableHead>
                    <TableHead>Dividends</TableHead>
                    <TableHead>Currency Gain</TableHead>
                    <TableHead>Total Return</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow className='bg-white transition-none hover:bg-white'>
                    <TableCell>
                        {USDollar.format(totalCapitalGain)}
                    </TableCell>
                    <TableCell>
                        {USDollar.format(totalDividends)}
                    </TableCell>
                    <TableCell>
                        {USDollar.format(0)}
                    </TableCell>
                    <TableCell>
                        {USDollar.format(totalCapitalGain + totalDividends)}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}