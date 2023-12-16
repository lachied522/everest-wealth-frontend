"use client";
import Link from "next/link";
import { LuMenu, LuBell, LuLogOut } from "react-icons/lu";

import { cn } from "@/components/lib/utils";

import SymbolSearch from "./symbol-search";
import NotificiationMenu from "./notification-menu";

import { useSidebarContext } from "@/context/SidebarState";

export default function Header({ userName }: { userName: string }) {
  const { 
    sidebarOpen: isOpen, 
    setSidebarOpen: setIsOpen, 
    isMobile 
  } = useSidebarContext();

  const today = new Date().toUTCString().slice(5, 16);

  return (
    <div className={cn(
      "bg-white w-full shadow-[0_2px_12px_rgba(11,22,44,0.05)] z-[1] px-16 items-center py-[14px] flex min-h-[78px] relative",
      isMobile && "pl-24"
    )}>
      {isMobile && (
        <LuMenu 
          className="absolute top-6 left-6"
          size={30} 
          onClick={() => setIsOpen(true)}
        />
      )}
      <div className="w-full flex items-center gap-6">
        <div>{today}</div>
        <SymbolSearch />
      </div>
      <div className="flex items-center gap-6 ml-auto ">
        <NotificiationMenu />
        <div className="text-sm font-medium text-slate-800">
          {userName}
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
