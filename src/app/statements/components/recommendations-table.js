"use client";
import { useState } from "react";

import Badge from "./badge";

const TransactionRow = ({ transaction }) => {

  const { symbol, difference } = transaction;

  return (
    <div className="recommendations-table-row">
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0042a-2fdc3ff5"
        className="table-item"
      >
        <div className="flex align-center">
          <div className="mg-bottom-0 mg-right-12px hidden-on-mbl w-form">
            <form>
              <label className="w-checkbox checkbox-field-wrapper">
                <div className="w-checkbox-input w-checkbox-input--inputType-custom checkbox"></div>
                <input
                  type="checkbox"
                  name="checkbox-2"
                  id="checkbox-2"
                  data-name="Checkbox 2"
                />
                <span
                  className="hidden-on-desktop w-form-label"
                  htmlFor="checkbox-2"
                >
                  Placeholder
                </span>
              </label>
            </form>
          </div>
          <div className="stock-data symbol">{symbol.toUpperCase()}</div>
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee0043d-2fdc3ff5"
        className="table-item"
      >
        <div className="table-item-mobile-caption">
          <div className="text-100 medium text-uppercase">Customer</div>
        </div>
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00441-2fdc3ff5"
          className="stock-data name"
        >
          John Carter
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00443-2fdc3ff5"
        className="table-item"
      >
        <div className="table-item-mobile-caption">
          <div className="text-100 medium text-uppercase">Date</div>
        </div>
        <div
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00447-2fdc3ff5"
          className="stock-data cost"
        >
          $10,000
        </div>
      </div>
      <div
        id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00449-2fdc3ff5"
        className="table-item"
      >
        <div className="table-item-mobile-caption">
          <div className="text-100 medium text-uppercase">Amount</div>
        </div>
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
          <Badge type={difference > 0? "buy": "sell"}/>
          <div className="stock-data units">{Math.round(Math.abs(difference)).toLocaleString()}</div>
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
          <div className="popup-wrapper">
            <div id="add-holding-popup" className="popup">
              <div
                data-w-id="b769fd57-11ac-4a78-32e8-eac03bc604b2"
                className="close-button-popup-module"
              >
                
              </div>
              <div className="grid-2-columns gap-18px _2-columns-mbl">
                <a
                  id="w-node-b769fd57-11ac-4a78-32e8-eac03bc604b5-2fdc3ff5"
                  data-w-id="b769fd57-11ac-4a78-32e8-eac03bc604b5"
                  href="#"
                  className="btn-secondary small w-button"
                >
                  Cancel
                </a>
                <a
                  id="add-holding"
                  href="#"
                  className="btn-primary small w-node-b769fd57-11ac-4a78-32e8-eac03bc604b7-2fdc3ff5 w-button"
                >
                  Done
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RecommendationsTable({ data }) {
  
  const transactions = data.transactions || [];

  //calculate total value
  const total = 10000;

  return (
    <div
      data-w-id="1c004669-7206-f90e-7b1a-bc8e4ee003fc"
      className="recommendations-table mg-bottom-64px"
    >
      <div className="recommendations-table-top-section">
        <div className="text-300 medium color-neutral-800">CURRENT RECOMMENDATION</div>
      </div>
      <div className="recommendations-table-row header">
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
          id="w-node-_1c004669-7206-f90e-7b1a-bc8e4ee00424-2fdc3ff5"
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase text-align-left">
            Recommended transaction
          </div>
        </div>
        <div
          id="w-node-_6c0fb0b5-73db-3fc0-f04f-37c224c1bcda-2fdc3ff5"
          className="table-column-header"
        >
          <div className="text-100 medium text-uppercase">Soa</div>
        </div>
      </div>
      {transactions.map((transaction, index) => (
        <TransactionRow 
          key={index}
          transaction={transaction} 
        />
      ))}
      {transactions.length !== 0 && (
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
                $0
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
                ${total.toLocaleString()}
              </div>
            </div>
            <a
              id="add-recommendations"
              href="#"
              className="btn-primary small w-button"
            >
              Make These Changes
            </a>
          </div>
        </div>
      )}
      {transactions.length === 0 && (
        <div className="recommendations-table-empty-container">
          <div className="text-300">No Recommendations</div>
        </div>
      )}
    </div>
  );
}
