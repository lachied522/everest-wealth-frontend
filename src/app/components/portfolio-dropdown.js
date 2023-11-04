"use client";
import { useState } from "react";
import Link from "next/link";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "@/components/lib/utils";

import { useGlobalContext } from "src/app/(main)/context/GlobalState";

export default function PortfolioDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { portfolioData } = useGlobalContext();

    return (
        <div
            className="z-[499] inline-block relative group"
        >
            <div className="items-center flex">
                <LuChevronDown className="duration-300 group-hover:rotate-180" />
            </div>
            <div className={cn(
                "bg-white min-w-[140px] flex flex-col items-center gap-4 py-4 border overflow-hidden -translate-x-1/4 shadow-[0_2px_12px_rgba(11,22,44,0.05)] rounded border-solid border-[#e9eaf3] absolute scale-0 duration-300 group-hover:scale-100",
                isOpen && "scale-100"
            )}>
            {portfolioData?.map(p => (
                <Link 
                    key={p.id}
                    href={`/portfolio/?p=${p.id}`}
                    className="px-4 text-[#303350] cursor-pointer no-underline hover:text-[#1476ff]" 
                >
                    {p.name}
                </Link>
            ))}
            </div>
        </div>
    )

}