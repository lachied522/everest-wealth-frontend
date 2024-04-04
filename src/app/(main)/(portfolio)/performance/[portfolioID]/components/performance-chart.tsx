"use client";
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Button } from '@/components/ui/button';
import { cn } from '@/components/lib/utils';

import type { TimeSeriesDataPoint } from '@/types/types';

function formatValue(value: number) {
    const million = 1e6;
    const thousand = 1e3;
  
    if (Math.abs(value) >= million) {
      return `$${(value / million).toFixed(0)}m`;
    } else if (Math.abs(value) >= thousand) {
      return `$${(value / thousand).toFixed(0)}k`;
    } else {
      return `$${value.toFixed(0)}`;
    }
}

const CustomTooltip = ({ active, payload } : {
    active: boolean,
    payload: any,
}) => {
    if (active && payload && payload.length) {
      return (
        <div className="flex flex-col bg-white rounded-sm shadow-sm p-2">
          <p className="text-sm">Portfolio {formatValue(payload[0].value)}</p>
          <p className="text-sm">Benchmark {payload[1].value.toFixed(0)}</p>
        </div>
      );
    }
  
    return null;
  };

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

interface PerformanceChartProps {
    name: string
    data?: TimeSeriesDataPoint[]
    benchmark?: TimeSeriesDataPoint[]
}

export default function PerformanceChart({
    name,
    data,
    benchmark
}: PerformanceChartProps) {
    const [timeframe, setTimeframe] = useState<Timeframe>(TIMEFRAMES[2])

    return (
        <>
            <div className='w-full flex flex-row items-start gap-x-2'>
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
            <ResponsiveContainer width='75%' minWidth={600} height={440}>
                <LineChart
                    margin={{
                        top: 5,
                        right: 30,
                        left: 30,
                        bottom: 5,
                    }}
                >
                    <XAxis
                        xAxisId="performance"
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
                    <YAxis
                        yAxisId="left"
                        domain={['auto', 'auto']}
                        tickFormatter={formatValue}
                    />
                    <YAxis
                        yAxisId="right"
                        domain={['auto', 'auto']}
                        orientation="right"
                    />
                    <Line
                        data={data.slice(1).slice(-timeframe.length)}
                        xAxisId="performance"
                        yAxisId="left"
                        type="monotone"
                        dataKey="value"
                        stroke="#2962FF"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                        name={name}
                    />
                    {benchmark && (
                    <Line
                        data={benchmark.slice(1).slice(-timeframe.length)}
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
                    )}
                    <Legend />
                    <Tooltip content={({ active, payload }) => <CustomTooltip active={active!} payload={payload} />}/>
                </LineChart>
            </ResponsiveContainer>
            ) : (
            <div className="h-[400px] flex items-center justify-center">No data to display</div>
            )}
        </>
      );
}