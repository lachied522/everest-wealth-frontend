"use client";
import { useState, useEffect, useCallback } from "react";

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
import { Skeleton } from "@/components/ui/skeleton";

import { LuPencil, LuSearch, LuTrash } from "react-icons/lu";

import { addStockInfoToPortfolio } from "../utils";

import debounce from "lodash.debounce";

import { useGlobalContext } from "@/context/GlobalState";

const SearchHit = ({ hit, selectHit }) => {

    const onClick = () => selectHit(hit);

    return (
        <div className="grid gap-0 cursor-pointer grid-rows-[auto] grid-cols-[0.25fr_1fr] auto-cols-[1fr] content-center justify-center items-center justify-items-center p-2.5" onClick={onClick}>
          <div>{hit.symbol}</div>
          <div className="text-[#0b0e2c] justify-start font-medium">{hit.name}</div>
        </div>
    );
};

const HoldingRow = ({ holdingData, update }) => {
    const [populatedData, setPopulatedData] = useState(null);

    useEffect(() => {
      let active = true; // keep track of whether component is active
      if (holdingData) getData();
      return () => {
          active = false;
      }

      async function getData() {
          const data = await addStockInfoToPortfolio([holdingData]);
          if (active) setPopulatedData(data[0]);
      }
    }, [holdingData]);

    // value column pre-populates if user fills units column and vice versa
    const changeValue = useCallback((e) => {
        if (!populatedData) return;
        const input = e.target.value;
        const units = Math.max(Math.floor(input / populatedData['last_price']), 1);
        update({
          ...holdingData,
          value: parseFloat(input),
          units: units,
        });
    }, [populatedData]);
    
    const changeUnits = useCallback((e) => {
        if (!populatedData) return;
        const input = e.target.value;
        const value = input * populatedData['last_price'];
        update({
          ...holdingData,
          value: value,
          units: parseFloat(input),
        });
    }, [populatedData]);

    const changeCost = useCallback((e) => {
      const input = e.target.value;
      update({
        ...holdingData,
        cost: parseFloat(input),
      });
    }, []);

    const removeHolding = useCallback(() => {
      // holding is removed by setting units to zero
      update({
        ...holdingData,
        value: 0,
        units: 0,
      });
    }, []);

    return (
        <div className="grid grid-rows-[auto] gap-0 grid-cols-[0.5fr_0.75fr_1fr_1fr_20px] auto-cols-[1fr] items-center justify-items-center p-1.5">
            <div className="">
              {holdingData['symbol'].toUpperCase()}
            </div>
            <Input
                type="number"
                className="max-w-[80px] text-slate-800 m-0"
                maxLength="256"
                name="units"
                data-name="units"
                min={1}
                value={holdingData['units'] || ""}
                onChange={changeUnits}
            />
            {populatedData ? (
            <Input
                type="number"
                className="max-w-[100px] text-slate-800 m-0"
                maxLength="256"
                name="value"
                data-name="value"
                min={populatedData['value'] || 0}
                value={populatedData['value'] || ""}
                onChange={changeValue}
            />
            ) : (
              <Skeleton className="max-w-[100px] m-0"/>
            )}
            <Input
                type="number"
                className="max-w-[100px] text-slate-800 m-0"
                maxLength="256"
                name="cost"
                data-name="cost"
                min="0"
                required
                value={holdingData['cost'] || ""}
                onChange={changeCost}
            />
            <LuTrash 
              className="cursor-pointer transition-colors duration-300 hover:text-[#dc2b2b]"
              onClick={removeHolding}
            />
        </div>
    );
};

export default function EditPortfolioPopup() {
  const { currentPortfolio, updatePortfolio, commitPortfolio } = useGlobalContext();
  const [searchString, setSearchString] = useState('');
  const [searchHits, setSearchHits] = useState([]);
  const [allHoldingData, setAllHoldingData] = useState([]); //contains all existing holdings and new holdings

  useEffect(() => {
    if (currentPortfolio) {
      const sortedData = currentPortfolio.holdings.sort((a, b) => a.symbol.localeCompare(b.symbol)); // sort data alphabetically 
      setAllHoldingData(sortedData);
    }
  }, [currentPortfolio]);

  const debouncedSearch = debounce(async (q) => {
    try {
        const params = new URLSearchParams({ q });
        const matches = await fetch(`/api/search-stocks?${params}`).then(res => res.json());
        matches.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setSearchHits(matches);
    } catch (e) {
        console.log(e);
    }
  }, 300);

  const searchStocks = (e) => {
    const input = e.target.value;
    // update state

    setSearchString(input); 
    if (input.length > 0) {
        // get matching symbols
        debouncedSearch(input);
    } else {
        setSearchHits([]);
    }
  };

  const selectHit = (hit) => {
    /**
     * when user selects a hit from stock search add to all holdings with units of 1
     */

    const newValue = [...allHoldingData, {
      ...hit,
      units: 1
    }];
    setAllHoldingData(newValue);

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

  const confirmHoldings = async () => {
    if (allHoldingData !== currentPortfolio.holdings) {
      // commit portfolio to DB
      const success = await commitPortfolio(currentPortfolio.id, allHoldingData);

      // update portfolio state
      if (success) {
        updatePortfolio(
          currentPortfolio.id,
          allHoldingData
        );
      }
    }
  }

  const cancelEdit = () => {
    //reset data
    setAllHoldingData(currentPortfolio.holdings);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={!currentPortfolio}
        >
          <LuPencil 
            className="mr-2"
          />
          Edit Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[80vh]">
        <DialogHeader>
          <DialogTitle>Add or Remove Holdings</DialogTitle>
        </DialogHeader>
        <form>
          <div className="flex flex-col gap-6 items-stretch justify-center relative">
            <div className="w-full flex items-center relative mb-6">
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
              <div>
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
                <ScrollArea className="h-[400px]">
                {allHoldingData.map((holding, index) => {
                  // zero unit holdings are filtered out
                  if (holding.units > 0) {
                    return (
                      <HoldingRow 
                        key={index}
                        holdingData={holding}
                        update={updateHolding}
                    />
                    )
                  }
                })}
                </ScrollArea>
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
