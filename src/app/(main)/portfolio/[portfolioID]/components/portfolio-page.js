"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/GlobalState";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { LuLink } from "react-icons/lu";

import PortfolioSettingsPopup from "./portfolio-settings-popup";
import PortfolioStatBar from "./portfolio-stat-bar";
import EditPortfolioPopup from "./edit-portfolio-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTabs from "./portfolio-tabs";


export default function PortfolioPage() {
  const { currentPortfolio } = useGlobalContext();
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [loadingNewAdvice, setLoadingNewAdvice] = useState(false);


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
          ): (
          <Skeleton className="w-[240px] h-10"/>
          )}
          <div className="flex gap-4">
            <Button
              variant="secondary"
            >
              <LuLink className="mr-2" />
              Link Broker
            </Button>
            <EditPortfolioPopup />
            <NewAdvicePopup />
          </div>
        </div>
      </div>
      <PortfolioStatBar />
      <PortfolioTabs
        loadingNewData={loadingNewData}
        loadingNewAdvice={loadingNewAdvice}
      />
    </>
  );
}
