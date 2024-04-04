"use client";
import { useMemo, useState } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { cn } from '@/components/lib/utils';

import type { TimeSeriesDataPoint } from '@/types/types';

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
  
type Timeframe = {
    label: '1M'|'3M'|'1Y'|'5Y'|'ALL'
    tickFormat: 'day'|'month'|'year'
    length: 20|60|240|1200
}

const TIMEFRAMES: Timeframe[] = [
    {
        label: '1Y',
        tickFormat: 'month',
        length: 240,
    }, 
    {
        label: '5Y',
        tickFormat: 'year',
        length: 1200,
    },
    {
        label: 'ALL',
        tickFormat: 'year',
        length: 1200,
    },
]

interface DividendChartProps {
    data?: TimeSeriesDataPoint[]
    name: string
}

export default function DividendChart({ data, name }: DividendChartProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAMES[2])

    return (
        <>
            <div className='flex flex-row gap-x-2'>
            {TIMEFRAMES.map((t, index) => (
                <Button
                    key={`t-${index}`}
                    variant='ghost'
                    onClick={() => setTimeframe(t)}
                    className={cn(
                        timeframe===t && 'bg-accent text-accent-foreground'
                    )}
                >
                    {t.label}
                </Button>
            ))}
            </div>
            {data ? (
            <ResponsiveContainer width='75%' minWidth={600} height={400}>
                <BarChart
                    data={data.slice(1).slice(-timeframe.length)}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <XAxis 
                        dataKey="date"
                        tickFormatter={(date: Date) => date.toUTCString().slice(8, 16)}
                        tickCount={4}
                    />
                    <YAxis
                        tickFormatter={(value: number) => USDollar.format(value)}
                    />
                    {/* <Tooltip /> */}
                    <Legend />
                    <Bar
                        dataKey="value"
                        fill="#8884d8"
                        barSize={48}
                        activeBar={<Rectangle fill="pink" stroke="blue" />}
                        name={name}
                    />
                </BarChart>
            </ResponsiveContainer>
            ) : (
            <div className="h-[400px] flex items-center justify-center">No data to display</div>
            )}
        </>
      );
}