import { PortfolioProvider } from "./context/PortfolioState";

import PortfolioSettingsPopup from "./modals/portfolio-settings-popup";
import EditPortfolioPopup from "./modals/edit-portfolio-popup";
import NewAdvicePopup from "./modals/new-advice-popup";
import PlainLinkButton from "./modals/PlaidLinkButton";
import PortfolioStatBar from "./portfolio-stat-bar";

export default function PortfolioLayout({ children } : { children: React.ReactNode }) {

    return (
        <PortfolioProvider>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                    <PortfolioSettingsPopup />
                    <div className="flex gap-4">
                        <PlainLinkButton />
                        <EditPortfolioPopup />
                        <NewAdvicePopup />
                    </div>
                </div>
                <PortfolioStatBar />
            </div>
            {children}
        </PortfolioProvider>
    )
}