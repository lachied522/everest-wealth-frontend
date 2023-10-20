"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';

import { useGlobalContext } from "@/context/GlobalState";

import { Button } from "@/components/ui/button";

import { LuLink } from "react-icons/lu";

import PortfolioName from "@/components/portfolio-name";
import PortfolioDropdown from "@/components/portfolio-dropdown";
import PortfolioStatBar from "./portfolio-stat-bar";
import EditPortfolioPopup from "./edit-portfolio-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTabs from "./portfolio-tabs";



const checkDate = (dateTimeString) => {
  //function for checking whether advice is current
  const today = new Date();
  const datetime = new Date(dateTimeString);
  return (
    datetime.getDate() == today.getDate() &&
    datetime.getMonth() == today.getMonth() &&
    datetime.getFullYear() == today.getFullYear()
  )
}

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const { portfolioData, adviceData } = useGlobalContext(); //raw portfolio data
  const [currentPortfolio, setCurrentPortfolio] = useState(null); //keeps track of current portfolio being viewed
  const [currentAdvice, setCurrentAdvice] = useState(null);

  useEffect(() => {
    //set current portfolio data
    const portfolioID = searchParams.get('p');
    if ( portfolioID && portfolioData ) {
      let index = portfolioData.findIndex((obj) => obj.id === portfolioID);
      if ( index > 0 ) {
        setCurrentPortfolio(portfolioData[index]);
      } else {
        setCurrentPortfolio(portfolioData[0]);
      }
    } else {
      //default portfolio to first portfolio
      setCurrentPortfolio(portfolioData ? portfolioData[0]: null);
    }
  }, [searchParams, portfolioData]);

  useEffect(() => {
    //check if any current recommendations
    if (adviceData && currentPortfolio) {
        const recs = adviceData.filter(obj => obj.portfolio_id === currentPortfolio.id);
        
        if (recs.length > 0 && !recs[0].actioned) {
          setCurrentAdvice(recs[0]);
        } else {
          setCurrentAdvice({
            transactions: []
          });
        };
    };
  }, [adviceData, currentPortfolio]);

  return (    
    <div className="container-default w-container">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 sm:gap-2 items-center">
              <PortfolioName portfolio={currentPortfolio} />
              <PortfolioDropdown />
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
            >
              <LuLink className="mr-2" />
              Link Broker
            </Button>
            <EditPortfolioPopup
              portfolio={currentPortfolio}
            />
            <NewAdvicePopup
              portfolio={currentPortfolio}
            />
          </div>
        </div>
      </div>
      <PortfolioStatBar portfolio={currentPortfolio} />
      <PortfolioTabs portfolioID={currentPortfolio?.id} data={currentPortfolio?.data} />
    </div>
  );
}
