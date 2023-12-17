import { PortfolioProvider } from "./context/PortfolioState";

import PortfolioSettingsPopup from "./components/modals/portfolio-settings-popup";
import PortfolioStatBar from "./components/portfolio-stat-bar";
import EditPortfolioPopup from "./components/modals/edit-portfolio-popup";
import NewAdvicePopup from "./components/modals/new-advice-popup";
import PlainLinkButton from "./components/modals/PlaidLinkButton";
import PortfolioChartBar from "./components/charts/portfolio-chart-bar";
import PortfolioTabs from "./components/portfolio-tabs"


export default async function PortfolioPage() {
  
  return (
      <PortfolioProvider>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <PortfolioSettingsPopup />
            <div className="flex gap-4">
              <PlainLinkButton />
              <EditPortfolioPopup />
              <NewAdvicePopup />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <PortfolioStatBar />
          <PortfolioChartBar />
          <PortfolioTabs />
        </div>
      </PortfolioProvider>
  );
}