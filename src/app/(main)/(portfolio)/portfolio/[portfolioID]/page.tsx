import PortfolioChartBar from "./components/charts/portfolio-chart-bar";
import PortfolioTabs from "./components/portfolio-tabs"

export default async function PortfolioPage() {
  
  return (
      <div className="flex flex-col gap-6">
        <PortfolioChartBar />
        <PortfolioTabs />
      </div>
  );
}