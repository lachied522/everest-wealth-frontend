import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader } from '@/components/ui/card';

// prevent hydration errors with recharts library
const PortfolioAllocationChart = dynamic(
    () => import("./portfolio-allocation-chart"), 
    { 
        ssr: false,
        loading: () => (
            <div className="h-[100px] w-[100px]" />
        )
    }
);

const ACCESSORS: ('sector'|'domestic'|'active')[] = ['sector', 'domestic', 'active']

export default function PortfolioChartBar() {

    return (
        <div className="grid grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between flex-wrap gap-4 mb-6">
            {ACCESSORS.map((accessor) => (
                <Card key={`chart-${accessor}`} className='h-full flex items-center justify-center p-2'>
                    <CardContent className='flex items-center justify-center p-0'>
                        <CardHeader>
                            <div className='text-sm font-medium'>
                                {accessor.charAt(0).toUpperCase() + accessor.slice(1)} Allocation
                            </div>
                        </CardHeader>
                        <PortfolioAllocationChart accessor={accessor} />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}