"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

import { useGlobalContext } from "@/context/GlobalState";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { LuLink } from "react-icons/lu";

import PortfolioName from "@/components/portfolio-name";
import PortfolioDropdown from "@/components/portfolio-dropdown";
import PortfolioStatBar from "./portfolio-stat-bar";
import EditPortfolioPopup from "./edit-portfolio-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTabs from "./portfolio-tabs";

const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL;

export function addStockInfoToPortfolio(portfolioData, universeDataMap) {
  if (!portfolioData) return;

  //calculate total value of portfolio for weight calculations
  //const totalValue = portfolioData.reduce((acc, obj) => acc + parseFloat(obj.price * obj.units), 0);

  const newArray = portfolioData.map(({ id, symbol, units, cost, locked }) => {
      if (!universeDataMap.has(symbol)) return { id, symbol, units, cost };
      const price = universeDataMap.get(symbol).last_price;

      const value = (price * units).toFixed(2);
      //const weight =  (100*(value / totalValue)).toFixed(2);
      const totalCost = cost? (cost * units).toFixed(2): 0;
      const totalProfit = ((cost? (price - cost): price) * units).toFixed(2);

      return { ...universeDataMap.get(symbol), id, symbol, units, cost, locked, value, price, totalCost, totalProfit };
  });

  return newArray;
}

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
  const { session, portfolioData, updatePortfolio } = useGlobalContext(); //raw portfolio data
  const [currentPortfolio, setCurrentPortfolio] = useState(null); //keeps track of current portfolio being viewed
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [loadingNewData, setLoadingNewData] = useState(false);
  const [loadingNewAdvice, setLoadingNewAdvice] = useState(false);

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
    // check if any current recommendations
    if (currentPortfolio) {
        const recs = currentPortfolio.advice;
        if (recs.length > 0 && !recs[recs.length - 1].actioned) {
          setCurrentAdvice(recs[recs.length - 1]);
        } else {
          setCurrentAdvice({
            transactions: []
          });
        };
    };
  }, [currentPortfolio]);

  const confirmTransactions = async () => {
    setCurrentAdvice({
      transactions: []
    });
    setLoadingNewData(true);
    fetch('api/confirm-advice', {
        method: "POST",
        body: JSON.stringify(currentAdvice),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    })
    .then(res => res.json())
    .then(data => {
      const newPortfolio = data[0];
      updatePortfolio(
        newPortfolio.id,
        newPortfolio.data
      )
    })
    .catch(err => console.log(err))
    .finally(() => setLoadingNewData(false));
  }

  const onNewAdvice = (data) => {
    setLoadingNewAdvice(true);
    fetch(`${WEB_SERVER_BASE_URL}/new_advice/${session.user.id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    })
    .then(res => res.json())
    .then(advice => {
      setCurrentAdvice(advice);
    })
    .catch(err => console.log(err))
    .finally(() => setLoadingNewAdvice(false));
  }    

  return (    
    <div className="md:max-w-screen-xl px-6 mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 sm:gap-2 items-center">
              {currentPortfolio? (
                <>
                  <PortfolioName portfolio={currentPortfolio} />
                  <PortfolioDropdown />
                </>
              ): <Skeleton className="w-[240px] sm:w=[80px] h-10"/>}
          </div>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => adviceTabRef.current.click()}
            >
              <LuLink className="mr-2" />
              Link Broker
            </Button>
            <EditPortfolioPopup
              portfolio={currentPortfolio}
            />
            <NewAdvicePopup
              portfolio={currentPortfolio}
              onSubmit={onNewAdvice}
            />
          </div>
        </div>
      </div>
      <PortfolioStatBar portfolio={currentPortfolio} />
      <PortfolioTabs 
        portfolioData={currentPortfolio} 
        adviceData={currentAdvice}
        onAdviceConfirm={confirmTransactions}
        loadingNewData={loadingNewData}
        loadingNewAdvice={loadingNewAdvice}
      />
    </div>
  );
}
