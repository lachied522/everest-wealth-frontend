
import PortfolioAllocationChart from "./portfolio-allocation-chart";

export default function PortfolioChartBar() {

    return (
        <div className="grid grid-rows-[auto] grid-cols-[repeat(auto-fit,minmax(248px,1fr))] auto-cols-[1fr] justify-between flex-wrap gap-4 mb-6">
            <PortfolioAllocationChart accessor='sector' />
            <PortfolioAllocationChart accessor='domestic' />
            <PortfolioAllocationChart accessor='active' />
        </div>
    )
}