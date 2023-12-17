"use client";
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/lib/utils';
  
type Timeframe = {
    label: '1M'|'3M'|'1Y'|'5Y'
    tickFormat: 'day'|'month'|'year'
    length: 20|60|240|1200
}

const TIMEFRAMES: Timeframe[] = [
    {
        label: '1M',
        tickFormat: 'day',
        length: 20,
    }, 
    {
        label: '3M',
        tickFormat: 'month',
        length: 60,
    }, 
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
]

type TimeSeriesDataPoint = {
    date: Date;
    value: number;
};

interface PortfolioPerformanceChartProps {
    data: TimeSeriesDataPoint[]
}

export default function PortfolioPerformanceChart({ data }: PortfolioPerformanceChartProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAMES[2])

    console.log(new Date().toUTCString())

    return (
        <Card>
            <CardHeader>
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
            </CardHeader>
            <CardContent>
                <LineChart
                    width={500}
                    height={300}
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
                    <YAxis />
                    {/* <Tooltip /> */}
                    <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2962FF"
                        strokeWidth={2}
                        isAnimationActive={false}
                        dot={false}
                    />
                </LineChart>
            </CardContent>
        </Card>
      );
}