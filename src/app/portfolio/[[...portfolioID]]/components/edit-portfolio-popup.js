"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/GlobalState";
import Popup from "@/components/popup";

const SearchHit = ({ hit, selectHit }) => {

    const onClick = () => {
        selectHit(hit)
    }

    return (
        <div className="holding-search-results-row" onClick={onClick}>
        <div className="stock-data symbol">{hit.symbol}</div>
        <div className="stock-data name">{hit.name}</div>
        </div>
    );
};

const HoldingRow = ({ data, update, remove }) => {
    //value column pre-populates if user fills units column and vice versa
    const changeValue = (e) => {
        const input = e.target.value;
        const units = Math.floor(input / data.last_price);
        update({
          ...data,
          value: parseFloat(input),
          units: units,
        });
    }
    
    const changeUnits = (e) => {
        const input = e.target.value;
        const value = input * data.last_price;
        update({
          ...data,
          value: value,
          units: parseFloat(input),
        });
    }

    const changeCost = (e) => {
      const input = e.target.value;
      update({
        ...data,
        cost: parseFloat(input),
      });
    }

    const removeHolding = () => {
      remove(data);
    }

    return (
        <div className="add-holding-row" >
            <div
                id="w-node-_30654599-6362-208c-d8b9-90b6b8929f48-2fdc3ff5"
                className="stock-data symbol"
            >
              {data.symbol.toUpperCase()}
            </div>
            <input
                type="number"
                className="stock-data-input units w-node-_30654599-6362-208c-d8b9-90b6b8929f4a-2fdc3ff5 w-input"
                maxLength="256"
                name="units"
                data-name="units"
                min="0"
                placeholder="e.g. 100"
                value={data.units || ""}
                onChange={changeUnits}
            />
            <input
                type="number"
                className="stock-data-input value w-node-_30654599-6362-208c-d8b9-90b6b8929f4b-2fdc3ff5 w-input"
                maxLength="256"
                name="value"
                data-name="value"
                min="0"
                placeholder="e.g. $1000"
                value={data.value || ""}
                onChange={changeValue}
            />
            <input
                type="number"
                className="stock-data-input cost w-node-_30654599-6362-208c-d8b9-90b6b8929f4c-2fdc3ff5 w-input"
                maxLength="256"
                name="cost"
                data-name="cost"
                min="0"
                placeholder="e.g. $500"
                required=""
                value={data.cost || ""}
                onChange={changeCost}
            />
            <div 
              className="custom-icon delete-icon"
              onClick={removeHolding}
            ></div>
        </div>
    );
};

export default function EditPortfolioPopup({ isOpen, setIsOpen, portfolio }) {
  const { universeData, updatePortfolio } = useGlobalContext();
  const [searchString, setSearchString] = useState('');
  const [searchHits, setSearchHits] = useState([]);
  const [allHoldingData, setAllHoldingData] = useState(portfolio); //contains all existing holdings and new holdings

  const closePopup = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (portfolio) {
      const sortedData = portfolio.data?.sort((a, b) => a.symbol.localeCompare(b.symbol)); //sort data alphabetically 
      setAllHoldingData(sortedData);
    }
  }, [portfolio]);

  const searchStocks = (e) => {
    /**
     * defines behaviour of search bar for adding stocks to portfolio
     */
    const input = e.target.value.toUpperCase();
    setSearchString(input);

    const dataArray = Object.values(universeData);

    //get matching symbols
    let matches = [];
    if (input.length > 0) {
      let symbols = dataArray.map((obj) => obj.symbol); //extract symbols
      let names = dataArray.map((obj) => obj.name?.toUpperCase()); //extract names
      for (let i = 0; i < symbols.length; i++) {
        try {
          if (
            symbols[i].indexOf(input) > -1 ||
            (names[i].indexOf(input) > -1 && input.length > 2)
          ) {
            matches.push(dataArray[i]);
          }
        } catch (error) {
          //missing data
        }
      }
    }
    //sort by alphabetical order of symbol
    matches.sort((a, b) => b.symbol.localeCompare(a.symbol));
    //set search hits
    setSearchHits(matches);
  };

  const selectHit = (hit) => {
    /**
     * when user selects a hit from stock search
     */
    if (allHoldingData) {
      const newValue = [...allHoldingData, hit];
      setAllHoldingData(newValue);
    } else {
      setAllHoldingData([hit]);
    }

    //reset search bar
    setSearchString('');
    //clear search hits
    setSearchHits([]);
  }

  const updateHolding = (holding) => {
    /**
     * when user updates the value of a new holding
     */
    const newArray = [...allHoldingData]; //create copy of all holdings
    const index = allHoldingData.findIndex((obj) => obj.symbol === holding.symbol); //get index of holding
    newArray[index] = holding;
    setAllHoldingData(newArray);
  }

  const removeHolding = (holding) => {
    const newValue = allHoldingData.filter(obj => obj.symbol !== holding.symbol);
    setAllHoldingData(newValue);
  }

  const confirmHoldings = async () => {
    //check if any data is missing
    const empty = allHoldingData.filter(holding => !holding.hasOwnProperty('units') || holding.units === 0);
    if (empty.length === 0) {
      if (allHoldingData !== portfolio.data) {
        //update portfolio
        await updatePortfolio(
          portfolio.id,
          allHoldingData
        );
      }
      //close the popup
      closePopup();
    }
  }

  const cancelEdit = () => {
    //reset
    setAllHoldingData(portfolio.data);
    //close the popup
    closePopup();
  }

  if (isOpen) {
    return (
      <Popup title="Add or Remove Holdings" closePopup={closePopup}>
        <div className="holding-search-container">
          <form action="/search" className="stock-search-bar-wrapper w-form">
            <input
              type="search"
              className="input stock-search-bar w-input"
              maxLength="18"
              placeholder="Search for..."
              value={searchString}
              onChange={searchStocks}
            />
            <div className="line-rounded-icon dashboard-top-search-bar-icon">
              
            </div>
          </form>
          <div className="w-form">
            <form>
              <div className="position-relative">
                {searchString.length > 0 && (
                  <div className="holding-search-results">
                    {searchHits.map((hit, index) => (
                      <SearchHit
                        key={index}
                        hit={hit}
                        selectHit={selectHit}
                      />
                    ))}
                  </div>
                )}
                <div className="add-holdings-wrapper">
                  <div className="new-holdings-table">
                    <div className="add-holding-row header">
                      <div
                        id="w-node-aada2c88-095c-41ee-3708-185e74c35476-2fdc3ff5"
                        className="stock-data symbol"
                      >
                        SYMBOL
                      </div>
                      <div
                        id="w-node-_7ae1bf53-84a0-b9a9-870a-bf5bf74bb8d0-2fdc3ff5"
                        className="stock-data symbol"
                      >
                        UNITS
                      </div>
                      <div
                        id="w-node-_52b8974b-9757-d3d5-62ab-a4812700edc9-2fdc3ff5"
                        className="stock-data symbol"
                      >
                        VALUE ($)
                      </div>
                      <div
                        id="w-node-_433de180-3cff-0762-e7de-fce773e5e1eb-2fdc3ff5"
                        className="stock-data symbol"
                      >
                        COST ($)
                      </div>
                    </div>
                    {allHoldingData?.length === 0 && (
                      <div className="holding-search-empty">
                        <div className="text-200">
                          Search stocks to add to your portfolio
                        </div>
                      </div>
                    )}
                    {allHoldingData?.map((holding, index) => (
                        <HoldingRow 
                            key={index}
                            data={holding}
                            update={updateHolding}
                            remove={removeHolding}
                        />
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="grid-2-columns gap-18px _2-columns-mbl">
          <button
            className="btn-secondary small w-button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
          <button
            className="btn-primary small w-button"
            onClick={confirmHoldings}
          >
            Done
          </button>
        </div>
      </Popup>
    );
  }
}
