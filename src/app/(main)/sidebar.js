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
  LuSettings
 } from "react-icons/lu";

import { Separator } from "@/components/ui/separator";

import { useSidebarContext } from "./context/SidebarState";
import { useGlobalContext } from "./context/GlobalState";

const PAGES = [
  {
    name: "Dashboard",
    href: "/dashboard",
    Icon: BiHomeAlt2,
  },
  {
    name: "Portfolio",
    href: "/portfolio",
    Icon: BiBriefcaseAlt,
  },
  {
    name: "Performance",
    href: "",
    Icon:  LuFileLineChart,
  },
  {
    name: "Advice",
    href: "/advice",
    Icon: LuFileBarChart,
  },
  {
    name: "Profile",
    href: "/profile",
    Icon: LuUser2,
  },
  // {
  //   name: "Settings",
  //   href: "",
  //   Icon: LuSettings
  // }
];

const NavLink = ({ page, activePath, subPages }) => {
  const active = page.href === activePath;
  return (
    <div>
      <Link
        href={page.href}
        className={cn(
          "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
          active && "text-[#1476ff]"
        )}
      >
        <page.Icon size={24} />
        {page.name}
      </Link>
      {subPages?.map((page) => (
        <div className="w-full text-[#303350] text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]">Testing</div>
      ))}
    </div>
  );
};

export default function SideBar() {
  const pathname = usePathname();
  const { portfolioData, currentPortfolio } = useGlobalContext();
  const sidebarRef = useRef(null);

  const { 
    sidebarOpen: isOpen, 
    setSidebarOpen: setIsOpen, 
    isMobile 
  } = useSidebarContext();

  const closeSidebarOnOutsideClick = (event) => {
    // on mobile, close sidebar when user clicks outside
    if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
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
  }, [isOpen]);

  useEffect(() => {
    // close sidebar on nav click
    if(isMobile) setIsOpen(false);
  }, [pathname]);

  return (    
    <>
      {isMobile && (
        <div 
          className={cn(
            "z-[499] bg-slate-700 justify-center items-center fixed inset-0 opacity-50 hidden",
            isOpen && "flex"
          )}
        />
      )}
      <aside
        ref={sidebarRef}
        role="banner"
        className={cn(
          "z-[100] h-screen w-[180px] bg-white border-r border-r-slate-50 px-2 fixed m-0 overflow-auto shadow-sm shadow-slate-400 transition-all ease-in-out duration-300 translate-x-0",
          !isOpen && "translate-x-[-100%]"
        )}
      >
        <div>
          <div className="min-h-[74px] content-center justify-center flex py-[22px]">
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
          <div>
            <nav role="navigation">
              <div className="w-full flex flex-col justify-between">
                <div className="w-full flex flex-col">
                    <Separator className="my-4 bg-neutral-300" />
                    <div>
                      <Link
                        href="/dashboard"
                        className={cn(
                          "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                          pathname==="/dashboard" && "text-[#1476ff]"
                        )}
                      >
                        <BiHomeAlt2 size={24} />
                        Dashboard
                      </Link>
                    </div>
                    <Separator className="my-4 bg-neutral-300" />
                    <div>
                      <div
                        className="w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base cursor-default"
                      > 
                        <BiBriefcaseAlt size={24} />
                        Portfolios
                      </div>
                      <div className="flex flex-col ml-7 my-1 gap-1.5">
                      {portfolioData?.map((p) => (
                        <Link 
                          key={p.id}
                          href={`/portfolio?p=${p.id}`}
                          className={cn(
                            "w-full text-[#303350] text-sm no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                            currentPortfolio===p && "text-[#1476ff]"
                          )}
                        >
                          {p.name}
                        </Link>
                      ))}
                      </div>
                    </div>
                    <Separator className="my-4 bg-neutral-300" />
                    <div>
                      <Link
                        href=""
                        className={cn(
                          "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                          pathname==="/perfomance" && "text-[#1476ff]"
                        )}
                      >
                        <LuFileLineChart size={24} />
                        Performance
                      </Link>
                    </div>
                    <Separator className="my-4 bg-neutral-300" />
                    <div>
                      <Link
                        href="/advice"
                        className={cn(
                          "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                          pathname==="/advice" && "text-[#1476ff]"
                        )}
                      >
                        <LuFileBarChart size={24} />
                        Advice
                      </Link>
                    </div>
                    <Separator className="my-4 bg-neutral-300" />
                    <div>
                      <Link
                        href="/profile"
                        className={cn(
                          "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                          pathname==="/profile" && "text-[#1476ff]"
                        )}
                      >
                        <LuUser2 size={24} />
                        Profile
                      </Link>
                    </div>
                </div>
                <Separator className="my-4 bg-neutral-300" />
                <div className="w-full flex gap-2 flex-col">
                  <Link
                    href={"/"}
                    className={cn(
                      "w-full grid grid-cols-[25px,1fr] text-[#303350] items-center justify-start p-3 gap-2 text-base no-underline transition-none cursor-pointer hover:text-[#1476ff]",
                      "/settings" === pathname && "text-[#1476ff]"
                    )}
                  >
                    <LuSettings size={24}/>
                    Settings
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      {!isMobile && <div className="w-[180px]" />}
    </>
  );
}
