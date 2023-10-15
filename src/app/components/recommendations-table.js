"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/GlobalState";

import Badge from "./badge";

const TransactionRow = ({ transaction: { symbol, name, difference, last_price } }) => {

  return (
    <div className="recommendations-table-row">
      
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0042a-2fdc3ff5"
        className="table-item"
      >
        <div className="flex align-center">
          <Badge type={difference > 0? "buy": "sell"}/>
          <div className="stock-data symbol">{symbol.toUpperCase()}</div>
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0043d-2fdc3ff5"
        className="table-item"
      >
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00441-2fdc3ff5"
          className="stock-data name"
        >
          {name ?? ""}
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00443-2fdc3ff5"
        className="table-item"
      >
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00447-2fdc3ff5"
          className="stock-data cost"
        >
          {Math.round(difference)}
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00449-2fdc3ff5"
        className="table-item"
      >
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0044d-2fdc3ff5"
          className="stock-data value"
        >
          $11,250
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0044f-2fdc3ff5"
        className="table-item"
      >
        <div className="flex gap-column-24px">
          <div className="stock-data units">${Math.round(Math.abs(last_price * difference)).toLocaleString()}</div>
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00455-2fdc3ff5"
        className="table-item last"
      >
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00459-2fdc3ff5"
          data-w-id="1c004669-7206-f90e-7b1a-bc8e4ee00459"
          className="display-inline-block"
        >
          <div className="custom-icon view-soa"></div>
        </div>
      </div>
    </div>
  );
};

export default function RecommendationsTable({ portfolio, advice }) {
  const { session, updatePortfolio, updateAdvice } = useGlobalContext();
  const [currentAdvice, setCurrentAdvice] = useState({
    transactions: []
  });
  const [total, setTotal] = useState(0);
  const [brokerage, setBrokerage] = useState(-100);
    
  useEffect(() => {
    if (advice) {
      setCurrentAdvice(advice);
      //calculate total value (negative = sell, positive = buy)
      setTotal(advice.transactions?.reduce((acc, obj) => acc - parseFloat(obj.difference), 0));
    }
  }, [advice]);

  const confirmTransactions = async () => {
    const res = await fetch('api/confirm-advice', {
        method: "POST",
        body: JSON.stringify(advice),
        headers: {
            "Content-Type": "application/json",
            token: session.access_token,
        }
    });
    return;
    if (!portfolio) return;
    //update advice to 'actioned'
    // const index = adviceData.indexOf(currentAdvice);
    // adviceData[index].actioned = true;
    // await updateAdvice(adviceData);
    //remove current recommendation
    setCurrentAdvice({
      transactions: []
    });
  }

  return (
    <div
      data-w-id="1c004669-7206-f90e-7b1a-bc8e4ee003fc"
      className="recommendations-table mg-bottom-64px"
    >
      <div className="recommendations-table-top-section">
        <div className="text-300 medium color-neutral-800">CURRENT RECOMMENDATION</div>
      </div>
      <div className="recommendations-table-row header">
        <div
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase text-align-left">
            Recommended transaction
          </div>
        </div>
        <div className="flex align-center">
          <div className="table-column-header sort-column descending">
            <div className="text-100 medium text-uppercase">Symbol</div>
          </div>
        </div>
        <div className="table-column-header">
          <div className="text-100 medium text-uppercase">Name</div>
        </div>
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0041a-2fdc3ff5"
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase">Cost</div>
        </div>
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0041f-2fdc3ff5"
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase">Price</div>
        </div>
        <div
          id="w-node-_6c0fb0b5-73db-3fc0-f04f-37c224c1bcda-2fdc3ff5"
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase">Soa</div>
        </div>
      </div>
      {currentAdvice.transactions?.map((transaction, index) => (
        <TransactionRow 
          key={index}
          transaction={transaction} 
        />
      ))}
      {currentAdvice.transactions?.length !== 0 && (
        <div className="recommendations-table-add-container">
          <div
            id="w-node-_83f1f5d0-ba11-e66d-bbfc-5311259b8a18-2fdc3ff5"
            className="flex vertical gap-row-16px"
          >
            <div className="recommendations-table-summary">
              <div
                id="w-node-_6d7ec096-8670-1774-b7a2-9f7f0836414b-2fdc3ff5"
                className="stock-data"
              >
                Est. Brokerage
              </div>
              <div
                id="w-node-d2aed6f9-bad4-2de3-1338-f0c43c8f40f8-2fdc3ff5"
                className="recommendations-summary brokerage"
              >
                ${brokerage.toLocaleString()}
              </div>
              <div
                id="w-node-_31366139-2879-9f70-b0c1-2605dde4e3d0-2fdc3ff5"
                className="stock-data"
              >
                Gross
              </div>
              <div
                id="w-node-_86346ebe-1460-b30f-a601-4bd9df445ec5-2fdc3ff5"
                className="recommendations-summary net"
              >
                ${total.toLocaleString()}
              </div>
              <div
                id="w-node-_31366139-2879-9f70-b0c1-2605dde4e3d0-2fdc3ff5"
                className="stock-data"
              >
                Net
              </div>
              <div
                id="w-node-_86346ebe-1460-b30f-a601-4bd9df445ec5-2fdc3ff5"
                className="recommendations-summary net"
              >
                ${(total-brokerage).toLocaleString()}
              </div>
            </div>
            <button
              className="btn-primary small w-button"
              onClick={confirmTransactions}
            >
              Make These Changes
            </button>
          </div>
        </div>
      )}
      {(!currentAdvice.transactions | currentAdvice.transactions?.length === 0) && (
        <div className="recommendations-table-empty-container">
          <div className="text-300">No Recommendations</div>
        </div>
      )}
    </div>
  );
}
