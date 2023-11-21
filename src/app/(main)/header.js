"use client";
import Link from "next/link";
import { LuMenu, LuBell, LuLogOut } from "react-icons/lu";

import { cn } from "@/components/lib/utils";

import SymbolSearch from "./symbol-search";

import { useSidebarContext } from "@/context/SidebarState";

export default function Header({ userName }) {
  const { 
    sidebarOpen: isOpen, 
    setSidebarOpen: setIsOpen, 
    isMobile 
  } = useSidebarContext();

  const height = 78;

  const today = new Date().toUTCString().slice(5, 16);

  return (
    <div className={cn(
      "bg-white w-full shadow-[0_2px_12px_rgba(11,22,44,0.05)] z-[1] px-8 items-center py-[14px] flex min-h-[78px] relative",
      isMobile && "pl-24"
    )}>
      {isMobile && (
        <LuMenu 
          className="absolute top-6 left-6"
          size={30} 
          onClick={() => setIsOpen(true)}
        />
      )}
      <div className="w-full items-center mr-6 flex gap-6">
        <div>{today}</div>
        <SymbolSearch />
      </div>
      <div className="items-center flex ml-auto gap-6">
        <Link
          href="/"  
          className="notification-container w-inline-block"
        >
          <LuBell />
        </Link>
        <img
          src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc3fc2_john-carter-nav-avatar-dashboardly-webflow-template.jpg"
          loading="eager"
          className="avatar-circle _02 mg-right-8px"
        />
        <div className="mb-1">
          <div className="text-sm font-medium text-slate-800">
            {userName}
          </div>
        </div>
        <form action="/auth/signout" method="post">
          <button type="submit">
            <LuLogOut color={"#ff414c"}/>
          </button>
        </form>
      </div>
    </div>
  );
}
