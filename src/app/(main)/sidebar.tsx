"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/components/lib/utils";

import { BiHomeAlt2, BiBriefcaseAlt } from "react-icons/bi";
import {
  LuFileLineChart,
  LuFileBarChart,
  LuUser2,
  LuSettings,
  LuChevronRight,
  LuPlus,
 } from "react-icons/lu";

import { Separator } from "@/components/ui/separator";

import { useSidebarContext } from "./context/SidebarState";
import { GlobalState, useGlobalContext } from "./context/GlobalState";
import { Button } from "@/components/ui/button";

import NewPortfolioPopup from "@/components/modals/new-portfolio-popup";

import type { PortfolioData } from "@/types/types";

interface PortfolioMenuItemProps {
  portfolio: PortfolioData
  activePath: string
  dropdownOpen: boolean
  toggleDropdownOpen: () => void
}

const PortfolioMenuItem = ({ portfolio, activePath, dropdownOpen, toggleDropdownOpen }: PortfolioMenuItemProps) => {
  const isOpen = dropdownOpen || activePath.includes(portfolio.id);

  return (
    <div className="group">
      <div
        className="w-full grid grid-cols-[1fr,25px] text-[#303350] items-center justify-start p-2 gap-2 ml-2 text-md cursor-pointer"
        onClick={() => toggleDropdownOpen()}
      >
        <span>{portfolio.name}</span>
        <LuChevronRight size={18} className={cn(
          "transition-transform duration-300 ease-in-out",
          isOpen && "rotate-90"
          )}/>
      </div>
      <div className={cn(
        "hidden flex-col ml-6 my-1 gap-1.5 transition-all duration-300",
        isOpen && "flex"
        )}>
        <Link
            href={`/portfolio/${portfolio.id}?tab=Overview`}
            className={cn(
              "w-full flex gap-2 text-[#24242b] text-sm no-underline transition-none cursor-pointer hover:text-[#1476ff]",
              activePath===`/portfolio/${portfolio.id}` && "text-[#1476ff]"
            )}
          >
          <BiBriefcaseAlt size={16} />
          Portfolio
        </Link>
        <Link
          href={`/performance/${portfolio.id}`}
          className={cn(
            "w-full flex gap-2 text-[#303350] text-sm no-underline transition-none cursor-pointer hover:text-[#1476ff]",
            activePath===`/performance/${portfolio.id}` && "text-[#1476ff]"
          )}
        >
          <LuFileLineChart size={16} />
          Performance
        </Link>
        <Link
          href={`/advice/${portfolio.id}`}
          className={cn(
            "w-full flex gap-2 text-[#303350] text-sm no-underline transition-none cursor-pointer hover:text-[#1476ff]",
            activePath===`/advice/${portfolio.id}` && "text-[#1476ff]"
          )}
        >
          <LuFileBarChart size={16} />
          Advice
        </Link>
      </div>
    </div>
  );
};

const NewPortfolioButton = () => {
  return (
    <NewPortfolioPopup>
      <Button variant="ghost" className="items-center justify-start p-3 mt-2">
        <LuPlus size={18} className="mr-2"/>
        New Portfolio
      </Button>
    </NewPortfolioPopup>
  )
}

export default function SideBar() {
  const { portfolioData } = useGlobalContext() as GlobalState;
  const { 
    sidebarOpen: isOpen, 
    setSidebarOpen: setIsOpen, 
    isMobile 
  } = useSidebarContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null); // keeps track of which menu option is open
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const toggleDropdownOpen = (index: number) => {
    if (openIndex===index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    };
  }

  useEffect(() => {
    // close dropdown on pathname change
    setOpenIndex(null);
  }, [pathname]);

  useEffect(() => {
    const closeSidebarOnOutsideClick = (event: MouseEvent) => {
      // on mobile, close sidebar when user clicks outside
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && isMobile) {
      // add a click event listener to the document to close the sidebar on outside click
      document.addEventListener('click', closeSidebarOnOutsideClick);
    } else {
      // remove the event listener when the sidebar is closed
      document.removeEventListener('click', closeSidebarOnOutsideClick);
    }

    return () => {
      // clean up the event listener when the component unmounts
      document.removeEventListener('click', closeSidebarOnOutsideClick);
    };
  }, [isOpen, isMobile, setIsOpen]);

  useEffect(() => {
    // close sidebar on nav click
    if(isMobile) setIsOpen(false);
    // close any open dropdowns
    setOpenIndex(null);
  }, [isMobile, setIsOpen]);

  return (
    <>
      {isMobile && (
        <div 
          className={cn(
            "z-[999] bg-slate-700 justify-center items-center fixed inset-0 opacity-50 hidden",
            isOpen && "flex"
          )}
        />
      )}
      <aside
        ref={sidebarRef}
        role="banner"
        className={cn(
          "z-[9999] w-[180px] h-screen bg-white border-r border-r-slate-50 px-2 fixed m-0 overflow-auto shadow-sm shadow-slate-400 transition-all ease-in-out duration-300 translate-x-0",
          !isOpen && "translate-x-[-100%]"
        )}
      >
        <div className="min-h-[74px] content-center justify-center flex">
          <Link
            href="/"
            className="w-full flex justify-center transform transition duration-300 relative hover:scale-105"
          >
            <Image
              src="/palladian.svg"
              alt="Palladian Logo"
              width={48}
              height={48}
            />
          </Link>
        </div>
        <nav role="navigation" className="w-full h-[calc(100vh-100px)] flex flex-col justify-between">
          <div className="flex flex-col">
            <Separator className="my-3 bg-neutral-300" />
            <Link
              href="/dashboard"
              className={cn(
                "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-2 gap-2 ml-2 text-md no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                pathname==="/dashboard" && "text-[#1476ff]"
              )}
            >
              <BiHomeAlt2 size={24} />
              Dashboard
            </Link>
            <Separator className="my-3 bg-neutral-300" />
            <Link
              href="/profile"
              className={cn(
                "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-2 gap-2 ml-2 text-md no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                pathname==="/profile" && "text-[#1476ff]"
              )}
              >
                <LuUser2 size={24} />
                Profile
              </Link>
              <Separator className="my-3 bg-neutral-300" />
              {portfolioData?.map((portfolio, index) => (
                <PortfolioMenuItem 
                  key={portfolio.id} 
                  portfolio={portfolio} 
                  activePath={pathname}
                  dropdownOpen={openIndex===index}
                  toggleDropdownOpen={() => toggleDropdownOpen(index)}
                />
              ))}
              {portfolioData.length < 5 && (
                <NewPortfolioButton />
              )}
          </div>
          <Link
            href={"/"}
            className={cn(
              "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-2 gap-2 ml-2 text-md no-underline transition-none cursor-pointer hover:text-[#1476ff]",
              "/settings" === pathname && "text-[#1476ff]"
            )}
          >
            <LuSettings size={24}/>
            Settings
          </Link>
        </nav>
      </aside>
      {!isMobile && <div className="min-w-[180px]" />}
    </>
  );
}
