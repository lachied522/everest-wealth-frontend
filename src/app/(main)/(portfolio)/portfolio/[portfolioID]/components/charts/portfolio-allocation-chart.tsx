
"use client";
import { useState, useMemo } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { PortfolioState, usePortfolioContext } from '@/context/portfolio/PortfolioState';

type Total = {
    name: string
    value: number
    colour?: string
}

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
  

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ActiveCell = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value } = props;
    
    return (
        <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius - 2}
            outerRadius={outerRadius + 2}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            cursor={'pointer'}
        />
    )
}

export default function PortfolioAllocationChart({ accessor }: {
    accessor: 'sector'|'domestic'|'active'
}) {
    const { currentPortfolio } = usePortfolioContext() as PortfolioState;
    const [activeIndex, setActiveIndex] = useState<number | undefined>();

    const data = useMemo(() => {
        return currentPortfolio.holdings.reduce(
            (totals: Total[], holding) => {
                if (holding[accessor] !== (null || undefined)) {
                    let name = '';
                    let colour = '';
                    switch (accessor) {
                        case ('active'): {
                            name = holding.active? 'Active': 'Passive'
                            colour = holding.active? '#0088FE': '#00C49F'
                            break
                        } 
                        case ('domestic'): {
                            name = holding.domestic? 'Domestic': 'International'
                            colour = holding.domestic? '#0088FE': '#00C49F'
                            break
                        }
                        case ('sector'): {
                            name = String(holding.sector)
                            break
                        }
                    }
                    const index = totals.findIndex((entry) => entry.name===name);
                    if (index > -1) {
                        totals[index].value += Math.round(holding.value*100)/100;
                    } else {
                        totals.push({
                            name,
                            colour,
                            value: Math.round((holding.value || 0 )*100)/100,
                        })
                    }
                }
                return totals;
            },
            []
        )
    }, [currentPortfolio, accessor]);

    return (
        <Card className='h-full flex items-center justify-center p-2'>
            <CardContent className='flex items-center justify-center p-0'>
                <CardHeader>
                    <div className='text-sm font-medium'>
                        {accessor.charAt(0).toUpperCase() + accessor.slice(1)} Allocation
                    </div>
                </CardHeader>
                <PieChart width={100} height={100}>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={ActiveCell}
                        data={data}
                        innerRadius={30}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                    >
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={entry.colour? entry.colour: COLORS[index % COLORS.length]} 
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(undefined)}
                        />
                    ))}
                    </Pie>
                    {/* <Legend 
                        align='left'
                        verticalAlign='middle'
                        layout='horizontal'
                    /> */}
                    <Tooltip
                        separator=' '
                        contentStyle={{background: 'white', borderRadius: '0.5rem'}}
                        formatter={(value, name, props) => USDollar.format(value as number)}
                    />
                </PieChart>
            </CardContent>
        </Card>
    );
}
