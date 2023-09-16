"use client";
import { useState } from "react";

import AddHoldingPopup from "./new-holding-popup";
import NewAdvicePopup from "./new-advice-popup";
import PortfolioTable from "./portfolio-table";

export default function PortfolioPage() {
  const [newHoldingPopupOpen, setNewHoldingPopupOpen] = useState(false);
  const [newAdvicePopupOpen, setNewAdvicePopupOpen] = useState(false);

  const openNewHoldingPopup = () => {
    setNewHoldingPopupOpen(true);
  }

  const openNewAdvicePopup = () => {
    setNewAdvicePopupOpen(true);
  }

  return (    
    <div className="container-default w-container">
      <AddHoldingPopup
        isOpen={newHoldingPopupOpen}
        setIsOpen={setNewHoldingPopupOpen}
      />
      <NewAdvicePopup
        isOpen={newAdvicePopupOpen}
        setIsOpen={setNewAdvicePopupOpen}
      />
      <div
        data-w-id="214a1850-0562-14d0-fe09-369daf912b3f"
        className="mg-bottom-32px"
      >
        <div className="grid-2-columns _2-col-mbl _1-col-mbp">
          <div id="w-node-_9a36722d-8aa5-34a7-299c-a8e21ca3d0e7-2fdc3ff5">
            <h1 className="heading-h4-size mg-bottom-12px">Portfolio</h1>
            <div className="text-400">
              Lorem ipsum dolor sit amet consectetur adipiscing.
            </div>
          </div>
          <div
            id="w-node-af3e5895-bd37-10bd-e54f-dda9951422c4-2fdc3ff5"
            className="flex gap-column-12px"
          >
            <div
              data-w-id="9a36722d-8aa5-34a7-299c-a8e21ca3d0ec"
              className="display-inline-block"
            >
              <button
                className="btn-secondary w-button"
                onClick={openNewHoldingPopup}
              >
                <span className="line-rounded-icon link-icon-left"></span>Add
                Holding
              </button>
            </div>
            <div
              id="w-node-eeb57ff6-678d-99bd-3a14-ccd27109b3f5-2fdc3ff5"
              data-w-id="eeb57ff6-678d-99bd-3a14-ccd27109b3f5"
              className="display-inline-block"
            >
              <button
                className="btn-primary w-button"
                onClick={openNewAdvicePopup}
              >
                <span className="line-rounded-icon link-icon-left"></span>Get
                Advice
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        data-current="Tab 1"
        data-easing="ease"
        data-duration-in="300"
        data-duration-out="100"
        className="w-tabs"
      >
        <div className="portfolio-tab-menu w-tab-menu">
          <a
            data-w-tab="Tab 1"
            className="btn-primary w-inline-block w-tab-link w--current"
          >
            <div>Overview</div>
          </a>
          <a
            data-w-tab="Tab 2"
            className="btn-primary w-inline-block w-tab-link"
          >
            <div>Income</div>
          </a>
          <a
            data-w-tab="Tab 3"
            className="btn-primary w-inline-block w-tab-link"
          >
            <div>Recommendations</div>
          </a>
        </div>
        <div className="portfolio-tab-content w-tab-content">
          <div data-w-tab="Tab 1" className="w-tab-pane w--tab-active">
              <PortfolioTable />
            <div
              data-w-id="55323117-e253-3109-3439-934d13b0e5d4"
              className="grid-2-columns _2-col-mbl mg-top-16px"
            >
              <div className="flex">
                <div className="text-200 medium color-accent-1">1 - 10 </div>
                <div className="text-200">of 640</div>
              </div>
              <div
                id="w-node-_221bdebd-e5b8-afcf-ad5e-51ba74255f52-2fdc3ff5"
                className="flex"
              >
                <a
                  href="#"
                  className="btn-circle-secondary table-button mg-right-6px w-inline-block"
                >
                  <div className="line-rounded-icon"></div>
                </a>
                <a
                  href="#"
                  className="btn-circle-secondary table-button w-inline-block"
                >
                  <div className="line-rounded-icon"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
