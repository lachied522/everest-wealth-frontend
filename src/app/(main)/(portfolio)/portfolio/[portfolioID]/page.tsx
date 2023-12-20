import PortfolioChartBar from "./components/charts/portfolio-chart-bar";
import PortfolioTabs from "./components/portfolio-tabs"

interface PortfolioPageProps {
  params: {
    portfolioID: string
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  
  return (
      <div className="flex flex-col gap-6">
        <PortfolioChartBar />
        <PortfolioTabs />
      </div>
  );
}