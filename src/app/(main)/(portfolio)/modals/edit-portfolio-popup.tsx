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

import debounce from "lodash.debounce";

import { useGlobalContext } from "@/context/GlobalState";
import { PortfolioState, usePortfolioContext } from "../context/PortfolioState";

import { PopulatedHolding, StockInfo } from "@/types/types";

// contains minimum information required for functionality
interface PartialHolding extends Partial<PopulatedHolding> {
  symbol: string
  units: number
  totalCost?: number
  last_price?: number
}

async function getStockPrice(symbol: string) {
    const params = new URLSearchParams({ s: symbol });
    const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());

    return data.last_price;
}

const SearchHit = ({ hit, selectHit } : { 
  hit: StockInfo, 
  selectHit: (hit: StockInfo) => void 
}) => {

    const onClick = () => selectHit(hit);

    return (
        <div className="grid gap-0 cursor-pointer grid-rows-[auto] grid-cols-[0.25fr_1fr] auto-cols-[1fr] content-center justify-center items-center justify-items-center p-2.5" onClick={onClick}>
          <div>{hit.symbol}</div>
          <div className="text-[#0b0e2c] justify-start font-medium">{hit.name}</div>
        </div>
    );
};

const HoldingRow = ({ holding, update } : { 
  holding: PartialHolding,
  update: (holding: PartialHolding) => void
}) => {
    const [stockPrice, setStockPrice] = useState<number | null>(null); // current stock price - must be fetched from api

    useEffect(() => {
      let active = true; // keep track of whether component is active

      if (holding) getData();
      return () => {
          active = false;
      }

      async function getData() {
        if (!holding.hasOwnProperty('last_price')) {
          const price = await getStockPrice(holding.symbol);
          if (active) setStockPrice(price);
        } else if (holding.last_price) {
          // data already populated
          setStockPrice(holding.last_price);
        }
      }
    }, [holding, setStockPrice]);

    // value column pre-populates if user fills units column and vice versa
    const changeValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!stockPrice) return;
        const input = parseFloat(e.target.value);
        update({
          ...holding,
          value: input,
          units: Math.max(Math.floor(input / stockPrice), 1),
        });
    }, [holding, update, stockPrice]);
    
    const changeUnits = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!stockPrice) return;
        const input = parseFloat(e.target.value);
        update({
          ...holding,
          value: input * stockPrice,
          units: input,
        });
    }, [holding, update, stockPrice]);

    const changeCost = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const input = parseFloat(e.target.value);
      update({
        ...holding,
        cost: input / holding.units,
        totalCost: input,
      });
    }, [holding, update]);

    const removeHolding = useCallback(() => {
      // holding is removed by setting units to zero
      update({
        ...holding,
        value: 0,
        units: 0,
      });
    }, [holding, update]);

    return (
        <div className="grid grid-rows-[auto] gap-0 grid-cols-[0.5fr_0.75fr_1fr_1fr_20px] auto-cols-[1fr] items-center justify-items-center p-1.5">
            <div className="">
              {holding.symbol.toUpperCase()}
            </div>
            <Input
                type="number"
                className="max-w-[80px] text-slate-800 m-0"
                maxLength={24}
                name="units"
                data-name="units"
                min={1}
                value={holding.units || 0}
                onChange={changeUnits}
            />
            {stockPrice ? (
            <Input
                type="number"
                className="max-w-[100px] text-slate-800 m-0"
                maxLength={24}
                name="value"
                data-name="value"
                min={stockPrice || 0}
                value={holding.value || 0}
                onChange={changeValue}
            />
            ) : (
              <Skeleton className="max-w-[100px] m-0"/>
            )}
            <Input
                type="number"
                className="max-w-[100px] text-slate-800 m-0"
                maxLength={24}
                name="cost"
                data-name="cost"
                min="0"
                value={holding.totalCost || 0}
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
  const { updatePortfolio } = useGlobalContext();
  const { currentPortfolio } = usePortfolioContext() as PortfolioState;
  const [searchString, setSearchString] = useState('');
  const [searchHits, setSearchHits] = useState<StockInfo[]>([]);
  const [allHoldingData, setAllHoldingData] = useState<PartialHolding[]>([]); // contains all existing holdings and new holdings

  useEffect(() => {
    if (currentPortfolio) {
      const sortedData = currentPortfolio.holdings.sort((a, b) => a.symbol.localeCompare(b.symbol)); // sort data alphabetically 
      setAllHoldingData(sortedData);
    }
  }, [currentPortfolio]);

  const debouncedSearch = debounce(async (q) => {
    try {
        const params = new URLSearchParams({ q });
        const matches = await fetch(`/api/search-stocks?${params}`).then(res => res.json()) as StockInfo[];
        matches.sort((a, b) => a.symbol.localeCompare(b.symbol));
        setSearchHits(matches);
    } catch (e) {
        console.log(e);
    }
  }, 300);

  const searchStocks = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const selectHit = (hit: StockInfo) => {
    // prevent duplicates
    if (!currentPortfolio.holdings.map((holding) => holding.symbol).includes(hit.symbol)) {
      setAllHoldingData([
        ...allHoldingData, 
        {
          ...hit,
          units: 1
        }
      ]);
    };

    // reset search bar
    setSearchString('');
    // clear search hits
    setSearchHits([]);
  }

  const updateHolding = useCallback((holding: PartialHolding) => {
    const newArray = [...allHoldingData]; // create copy of all holdings
    const index = allHoldingData.findIndex((obj) => obj.symbol === holding.symbol); // get index of holding
    newArray[index] = holding;
    setAllHoldingData(newArray);
  }, [allHoldingData]);

  const confirmHoldings = () => {
    // check for equality of allHoldingData
    if (allHoldingData !== currentPortfolio.holdings) {
      // commit updated holdings to DB
      const updatedHoldings = allHoldingData.filter(
        (newHolding) => !currentPortfolio.holdings.some(
          (currentHolding) => currentHolding === newHolding
        )
      );

      fetch('/api/commit-portfolio', {
        method: "POST",
          body: JSON.stringify({
              portfolio_id: currentPortfolio.id, 
              data: updatedHoldings,
          }),
          headers: {
              "Content-Type": "application/json",
          }
      })
      .then(res => res.json())
      .then(({ success, data }) => {
        // api route only returns updated holdings, combine updated and existing holdings for new portfolio
        const newPortfolioState = [
          ...allHoldingData.filter((holding) => !updatedHoldings.includes(holding)),
          ...data,
        ];

        if (success) {
          updatePortfolio(
            currentPortfolio.id,
            newPortfolioState,
          );
        }
      });
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
      <DialogContent>
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
                maxLength={18}
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
                        holding={holding}
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
