"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

import { useGlobalContext } from "@/context/GlobalState";

import PortfolioName from "@/components/portfolio-name";
import RecommendationsTable from "@/components/recommendations-table";
import EditPortfolioPopup from "./edit-portfolio-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTable from "./portfolio-table";

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
  const [totalValue, setTotalValue] = useState(0); //total portfolio value
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [portfolioDropdownOpen, setPortfolioDropdownOpen] = useState(false);
  const [editPortfolioPopupOpen, setEditPortfolioPopupOpen] = useState(false);
  const [newAdvicePopupOpen, setNewAdvicePopupOpen] = useState(false);
  

  useEffect(() => {
    //set current portfolio data
    const portfolioID = searchParams.get('p');
    if ( portfolioID ) {
      let index = portfolioData.findIndex((obj) => obj.id === portfolioID);
      if ( index > 0 ) {
        setCurrentPortfolio(portfolioData[index]);
      } else {
        setCurrentPortfolio(portfolioData[0]);
      }
    } else {
      //default portfolio to first portfolio
      setCurrentPortfolio(portfolioData[0]);
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

    setTotalValue(currentPortfolio?.data?.reduce((acc, obj) => acc + parseFloat(obj.value), 0) || 0);
  }, [adviceData, currentPortfolio]);


  const togglePortfolioDropdown = () => {
    setPortfolioDropdownOpen(!portfolioDropdownOpen);
  }

  const openEditPortfolioPopup = () => {
    setEditPortfolioPopupOpen(true);
  }

  const openNewAdvicePopup = () => {
    setNewAdvicePopupOpen(true);
  }

  return (    
    <div className="container-default w-container">
      <EditPortfolioPopup
        isOpen={editPortfolioPopupOpen}
        setIsOpen={setEditPortfolioPopupOpen}
        portfolio={currentPortfolio}
      />
      <NewAdvicePopup
        isOpen={newAdvicePopupOpen}
        setIsOpen={setNewAdvicePopupOpen}
        portfolio={currentPortfolio}
      />
      <div
        className="mg-bottom-32px"
      >
        <div className="grid-2-columns _2-col-mbl _1-col-mbp">
          <div className="flex align-center">
              <PortfolioName portfolio={currentPortfolio} />
              <div
                  data-hover="false"
                  data-delay="0"
                  className="dropdown-wrapper w-dropdown"
              >
                  <div className="dropdown-toggle w-dropdown-toggle" onClick={togglePortfolioDropdown}>
                      <div className="line-rounded-icon w-icon-dropdown-toggle" />
                  </div>
                  {portfolioDropdownOpen && (
                      <div className="dropdown-column-wrapper w-dropdown-list w--open">
                      {portfolioData.map(p => (
                          <Link 
                              className="w-dropdown-link" 
                              key={p.id}
                              href={`/portfolio/?p=${p.id}`}
                              onClick={() => setPortfolioDropdownOpen(false)}
                          >
                            {p.name}
                          </Link>
                      ))}
                      </div>
                  )}
              </div>
          </div>
          <div
            id="w-node-af3e5895-bd37-10bd-e54f-dda9951422c4-2fdc3ff5"
            className="flex gap-column-12px"
          >
            <button
              className="btn-secondary small w-button"
            >
            <span className="line-rounded-icon link-icon-left"></span>Link
            Broker
            </button>
            <button
              className="btn-secondary small w-button"
              onClick={openEditPortfolioPopup}
            >
              <span className="line-rounded-icon link-icon-left"></span>Edit
              Portfolio
            </button>
            <button
              className="btn-primary small w-button"
              onClick={openNewAdvicePopup}
            >
              <span className="line-rounded-icon link-icon-left"></span>Get
              Advice
            </button>
          </div>
        </div>
      </div>
      <div className="reports-top-details-container">
          <div
              id="w-node-_189a64fb-05bb-b2aa-4063-67cbe8bd4d4f-2fdc3fd8"
              data-w-id="189a64fb-05bb-b2aa-4063-67cbe8bd4d4f"
              className="module reports-top-details"
          >
              <img
              src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc9_users-icon-dashboardly-webflow-template.svg"
              loading="eager"
              alt="Users - Dashly X Webflow Template"
              className="reports-top-details-icon"
              />
              <div>
              <div className="text-200 medium">Objective</div>
              <div className="flex align-end">
                  <div className="text-100 bold color-neutral-800">{currentPortfolio?.objective}</div>
              </div>
              </div>
          </div>
          <div
              id="w-node-_15bcd904-cca9-3107-d162-2cf33da79d40-2fdc3fd8"
              data-w-id="15bcd904-cca9-3107-d162-2cf33da79d40"
              className="module reports-top-details"
          >
              <img
              src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc6_pageviews-icon-dashboardly-webflow-template.svg"
              loading="eager"
              alt="Pageviews - Dashly X Webflow Template"
              className="reports-top-details-icon"
              />
              <div>
              <div className="text-200 medium">Value</div>
              <div className="flex align-end">
                  <div className="display-4 mg-right-6px">${totalValue?.toLocaleString() || 0}</div>
                  <div className="text-100 medium mg-bottom-4px">
                  </div>
              </div>
              </div>
          </div>
          <div
              id="w-node-_80250c7f-9d0b-c675-8fdf-c4c1d780000b-2fdc3fd8"
              data-w-id="80250c7f-9d0b-c675-8fdf-c4c1d780000b"
              className="module reports-top-details"
          >
              <img
              src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc8_new-signups-icon-dashboardly-webflow-template.svg"
              loading="eager"
              alt="New Sign Ups - Dashly X Webflow Template"
              className="reports-top-details-icon"
              />
              <div>
              <div className="text-200 medium">Week return</div>
              <div className="flex align-end">
                  <div className="display-4 mg-right-6px">4.5K</div>
                  <div className="text-100 medium mg-bottom-4px">
                  <div className="flex">
                      <div className="color-red-300">3.1% </div>
                      <div className="custom-icon font-size-10px color-red-300">
                      
                      </div>
                  </div>
                  </div>
              </div>
              </div>
          </div>
          <div
              id="w-node-_98d9c2d1-c1b4-226d-dbcc-f9bf7d5abdc9-2fdc3fd8"
              data-w-id="98d9c2d1-c1b4-226d-dbcc-f9bf7d5abdc9"
              
              className="module reports-top-details"
          >
              <img
              src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc7_subscriptions-icon-dashboardly-webflow-template.svg"
              loading="eager"
              alt="Subscriptions - Dashly X Webflow Template"
              className="reports-top-details-icon"
              />
              <div>
              <div className="text-200 medium">Total return</div>
              <div className="flex align-end">
                  <div className="display-4 mg-right-6px">3.3K</div>
                  <div className="text-100 medium mg-bottom-4px">
                  <div className="flex">
                      <div className="color-green-300">11.3%</div>
                      <div className="custom-icon font-size-10px color-green-300">
                      
                      </div>
                  </div>
                  </div>
              </div>
              </div>
          </div>
      </div>
      <RecommendationsTable portfolio={currentPortfolio} advice={currentAdvice} />
      <PortfolioTable portfolioID={currentPortfolio?.id} data={currentPortfolio?.data || []} />
    </div>
  );
}
