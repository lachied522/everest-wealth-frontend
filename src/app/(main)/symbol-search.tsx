"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import debounce from "lodash.debounce";

import { Input } from "@/components/ui/input";

import { LuSearch } from "react-icons/lu";

import type { StockInfo } from "@/types/types";

const SearchHit = ({ hit, selectHit } : { 
    hit: StockInfo, 
    selectHit: (v: string) => void 
  }) => {
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
    const [searchString, setSearchString] = useState('');
    const [searchHits, setSearchHits] = useState<StockInfo[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

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

    const selectHit = (symbol: string) => {
        // navigate to symbol page
        router.push(`/symbol/${symbol}`);
        // reset search
        setSearchHits([]);
        setSearchString('');
        setIsOpen(false);
    }

    const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        // update state
        setSearchString(input);
        if (input.length > 0) {
            // get matching symbols
            debouncedSearch(input);
        } else {
            setSearchHits([]);
        }
    }

    useEffect(() => {
        const closeDropdownOnOutsideClick = (event: MouseEvent) => {
            // on mobile, close sidebar when user clicks outside
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
          document.addEventListener('click', closeDropdownOnOutsideClick);
        } else {
          document.removeEventListener('click', closeDropdownOnOutsideClick);
        }
    
        return () => {
          // clean up the event listener when the component unmounts
          document.removeEventListener('click', closeDropdownOnOutsideClick);
        };
      }, [isOpen]);

    return (
        <div ref={dropdownRef} className="w-64 relative">
            <div className="flex items-center relative">
                <LuSearch 
                    className="z-[1] text-[#989aad] text-lg leading-[1em] absolute left-2"
                />
                <Input 
                    type="search"
                    className="pl-8"
                    value={searchString}
                    onFocus={() => setIsOpen(true)}
                    onChange={onChange}
                    placeholder="Symbol"
                />
            </div>
            {isOpen && searchHits.length > 0 && (
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