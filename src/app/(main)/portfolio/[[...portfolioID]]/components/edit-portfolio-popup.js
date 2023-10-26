"use client";
import { useState, useEffect } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LuPencil, LuSearch, LuTrash } from "react-icons/lu";

import { addStockInfoToPortfolio } from "./portfolio-page";

import { useUniverseContext } from "@/context/UniverseState";
import { useGlobalContext } from "@/context/GlobalState";

const SearchHit = ({ hit, selectHit }) => {

    const onClick = () => {
        selectHit(hit)
    }

    return (
        <div className="grid gap-0 cursor-pointer grid-rows-[auto] grid-cols-[0.25fr_1fr] auto-cols-[1fr] content-center justify-center items-center justify-items-center p-2.5" onClick={onClick}>
          <div>{hit.symbol}</div>
          <div className="text-[#0b0e2c] justify-start font-medium">{hit.name}</div>
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
        <div className="grid grid-rows-[auto] gap-0 grid-cols-[0.5fr_0.75fr_1fr_1fr_20px] auto-cols-[1fr] items-center justify-items-center p-1.5">
            <div
                className="stock-data symbol"
            >
              {data.symbol.toUpperCase()}
            </div>
            <Input
                type="number"
                className="max-w-[80px] m-0"
                maxLength="256"
                name="units"
                data-name="units"
                min="0"
                placeholder="e.g. 100"
                value={data.units || ""}
                onChange={changeUnits}
            />
            <Input
                type="number"
                className="max-w-[100px] m-0"
                maxLength="256"
                name="value"
                data-name="value"
                min="0"
                placeholder="e.g. $1000"
                value={data.value || ""}
                onChange={changeValue}
            />
            <Input
                type="number"
                className="max-w-[100px] m-0"
                maxLength="256"
                name="cost"
                data-name="cost"
                min="0"
                placeholder="e.g. $500"
                required=""
                value={data.cost || ""}
                onChange={changeCost}
            />
            <LuTrash 
              className="cursor-pointer transition-colors duration-300 hover:text-[#dc2b2b]"
              onClick={removeHolding}
            />
        </div>
    );
};

export default function EditPortfolioPopup({ portfolio }) {
  const { universeDataMap } = useUniverseContext();
  const { updatePortfolio } = useGlobalContext();
  const [searchString, setSearchString] = useState('');
  const [searchHits, setSearchHits] = useState([]);
  const [allHoldingData, setAllHoldingData] = useState([]); //contains all existing holdings and new holdings

  useEffect(() => {
    if (portfolio) {
      const sortedData = portfolio.holdings?.sort((a, b) => a.symbol.localeCompare(b.symbol)); //sort data alphabetically 
      setAllHoldingData(sortedData);
    }
  }, [portfolio]);

  const searchStocks = (e) => {
    /**
     * defines behaviour of search bar for adding stocks to portfolio
     */
    const input = e.target.value.toUpperCase();
    setSearchString(input);

    //get matching symbols
    let matches = [];
    if (input.length > 0) {
      universeDataMap.forEach((value) => {
        if (
          value.symbol.indexOf(input) > -1 ||
          (input.length > 2 && value.name?.indexOf(input) > -1)
          ) {
            matches.push(value);
          }
      });
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

  const confirmHoldings = () => {
    // check if any data is missing
    // const empty = allHoldingData.filter(holding => !holding.hasOwnProperty('units') || holding.units === 0);
    if (allHoldingData !== portfolio.holdings) {
      //update portfolio
      updatePortfolio(
        portfolio.id,
        allHoldingData
      );
    }
  }

  const cancelEdit = () => {
    //reset data
    setAllHoldingData(portfolio.data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <LuPencil 
            className="mr-2"
          />
          Edit Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add or Remove Holdings</DialogTitle>
        </DialogHeader>
        <form>
          <div className="flex flex-col gap-6 items-stretch justify-center">
            <div className="w-full flex items-center relative">
              <LuSearch 
                className="z-[1] text-[#989aad] text-lg leading-[1em] absolute left-2"
              />
              <Input
                type="search"
                className="pl-8"
                maxLength="18"
                placeholder="Search for..."
                value={searchString}
                onChange={searchStocks}
              />
            </div>
            <div className="relative mb-6">
              {searchString.length > 0 && (
                <div className="z-10 gap-x-0.5 gap-y-0.5 bg-white flex-col justify-start block absolute overflow-auto inset-0">
                  {searchHits.map((hit, index) => (
                    <SearchHit
                      key={index}
                      hit={hit}
                      selectHit={selectHit}
                    />
                  ))}
                </div>
              )}
              <div className="min-h-[240px] max-h-[500px] overflow-auto">
                <div className="grid grid-rows-[auto] gap-0 grid-cols-[0.5fr_0.75fr_1fr_1fr_20px] auto-cols-[1fr] items-center justify-items-center p-1.5 bg-[#e9eaf3]">
                  <div>
                    SYMBOL
                  </div>
                  <div>
                    UNITS
                  </div>
                  <div>
                    VALUE ($)
                  </div>
                  <div>
                    COST ($)
                  </div>
                </div>
                {allHoldingData?.length === 0 && (
                  <div className="flex p-8 items-center justify-center">
                    <div>
                      Search stocks to add to your portfolio
                    </div>
                  </div>
                )}
                {addStockInfoToPortfolio(allHoldingData ?? [], universeDataMap).map((holding, index) => (
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
        <div className="grid gap-6 grid-cols-2 items-center">
          <DialogClose asChild>
            <Button
              variant="secondary"
              type="button"
              onClick={cancelEdit}
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={confirmHoldings}
              type="button"
            >
              Done
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
