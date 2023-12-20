"use client";
import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/lib/utils';
  
type Timeframe = {
    label: '1M'|'3M'|'1Y'|'5Y'|'ALL'
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
    {
        label: 'ALL',
        tickFormat: 'year',
        length: 1200,
    },
]

type TimeSeriesDataPoint = {
    date: Date
    value: number
};

interface PortfolioPerformanceChartProps {
    portfolio: TimeSeriesDataPoint[]
    benchmark: TimeSeriesDataPoint[]
}

export default function PortfolioPerformanceChart({
    portfolio, 
    benchmark
}: PortfolioPerformanceChartProps) {
    const today = new Date()
    const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAMES[2])

    return (
        <Card className='w-[600px]'>
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
                <ResponsiveContainer width='100%' height={300}>
                    <LineChart
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <XAxis
                            xAxisId="portfolio"
                            dataKey="date"
                            hide
                        />
                        <XAxis
                            xAxisId="benchmark"
                            dataKey="date"
                            tickFormatter={(date: Date) => date.toUTCString().slice(8, 16)}
                            tickCount={4}
                            // domain={[
                            //     benchmark[benchmark.length - timeframe.length].date.getTime(),
                            //     benchmark[benchmark.length - 1].date.getTime()
                            // ]}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Legend />
                        <Line
                            data={portfolio.slice(1).slice(-timeframe.length)}
                            xAxisId="portfolio"
                            yAxisId="left"
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2962FF"
                            strokeWidth={2}
                            isAnimationActive={false}
                            dot={false}
                            name="Portfolio"
                        />
                        <Line
                            data={benchmark.slice(1).slice(-timeframe.length*4)}
                            xAxisId="benchmark"
                            yAxisId="right"
                            type="monotone" 
                            dataKey="value" 
                            stroke="#FFA500"
                            strokeWidth={2}
                            isAnimationActive={false}
                            dot={false}
                            name="MSCI World Index"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      );
}