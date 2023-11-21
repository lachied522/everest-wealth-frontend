"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";

import { LuSearch } from "react-icons/lu";

import { useUniverseContext } from "@/context/UniverseState";

const SearchHit = ({ hit, selectHit }) => {
    const onClick = () => selectHit(hit.symbol);

    return (
        <div 
            className="grid gap-1 cursor-pointer grid-rows-[auto] grid-cols-[0.25fr_1fr] justify-center items-center px-4 py-2 hover:bg-slate-100/50" 
            onClick={onClick}
        >
          <div>{hit.symbol}</div>
          <div className="text-[#0b0e2c] font-medium text-start">{hit.name}</div>
        </div>
    );
};

export default function SymbolSearch() {
    const router = useRouter();
    const { universeDataMap } = useUniverseContext();
    const [searchString, setSearchString] = useState('');
    const [searchHits, setSearchHits] = useState([]);
    
    const selectHit = (symbol) => {
        // navigate to symbol page
        router.push(`/symbol/${symbol}`);
        // reset search
        setSearchHits([]);
        setSearchString('');
    }

    const onChange = (e) => {
        // update state
        setSearchString(e.target.value);

        // get matching symbols
        let matches = [];
        const input = e.target.value.toUpperCase();
        if (input.length > 0) {
            universeDataMap.forEach((value) => {
                if (value.symbol.startsWith(input) || (value.name?.startsWith(input))) {
                    matches.push(value);
                }
            });
        }
        // sort by alphabetical order of symbol
        matches.sort((a, b) => a.symbol.localeCompare(b.symbol));
        // set search hits
        setSearchHits(matches);
    }

    return (
        <div className="w-64 relative">
            <div className="flex items-center relative">
                <LuSearch 
                    className="z-[1] text-[#989aad] text-lg leading-[1em] absolute left-2"
                />
                <Input 
                    type="search"
                    className="pl-8"
                    value={searchString} 
                    onChange={onChange}
                    placeholder="Symbol"
                />
            </div>
            {searchHits.length > 0 && (
            <div className="w-full z-10 grid grid-cols-1 gap-y-0.5 bg-white justify-start rounded-md shadow-md overflow-auto absolute">
                {searchHits.slice(0, 10).map((hit, index) => (
                <SearchHit
                    key={index}
                    hit={hit}
                    selectHit={selectHit}
                />
                ))}
            </div>
            )}
        </div>
    )
}