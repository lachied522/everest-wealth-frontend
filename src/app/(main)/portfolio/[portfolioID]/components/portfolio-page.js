"use client";
import { usePortfolioContext } from "../context/PortfolioState";

import { Skeleton } from "@/components/ui/skeleton";

import PortfolioSettingsPopup from "./portfolio-settings-popup";
import PortfolioStatBar from "./portfolio-stat-bar";
import EditPortfolioPopup from "./edit-portfolio-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTabs from "./portfolio-tabs";
import PlainLinkButton from "./PlaidLinkButton";

export default function PortfolioPage() {
  const { currentPortfolio } = usePortfolioContext();

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {currentPortfolio? (
          <div className="flex gap-4 sm:gap-2 items-center">
            <PortfolioSettingsPopup />
            <div className="text-xl font-medium text-slate-800 mb-0">
              {currentPortfolio.name}
            </div>
          </div>
          ) : (
          <Skeleton className="w-[240px] h-10"/>
          )}
          <div className="flex gap-4">
            <PlainLinkButton />
            <EditPortfolioPopup />
            <NewAdvicePopup />
          </div>
        </div>
      </div>
      <PortfolioStatBar />
      <PortfolioTabs />
    </>
  );
}
