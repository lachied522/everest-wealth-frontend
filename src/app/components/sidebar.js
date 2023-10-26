"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { motion } from "framer-motion";

import { cn } from "@/components/lib/utils";

import { BiHomeAlt2, BiBriefcaseAlt } from "react-icons/bi";
import {
  LuFileLineChart,
  LuFileBarChart,
  LuUser2,
  LuSettings
 } from "react-icons/lu";

import { useSidebarContext } from "@/context/SidebarState";

const pages = [
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

const NavLink = ({ page, activePath }) => {
  const active = page.href === activePath;
  return (
    <Link
      href={page.href}
      className={cn(
        "w-full cursor-pointer text-[#303350] flex flex-col items-center p-3 gap-3 text-base no-underline transition-none hover:text-[#1476ff]",
        active && "text-[#1476ff]"
      )}
    >
      <page.Icon size={25} />
      {page.name}
    </Link>
  );
};

export default function SideBar() {
  const pathname = usePathname();
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
    if (isOpen) {
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
          "z-[500] h-screen max-w-[120px] bg-white border-r border-r-slate-50 px-5 fixed m-0 overflow-auto shadow-sm shadow-slate-400 transition-all ease-in-out duration-300 translate-x-0",
          !isOpen && "translate-x-[-100%]"
        )}
      >
        <div>
          <div className="min-h-[74px] content-center justify-center flex py-[22px]">
            <Link
              href="/"
              className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
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
              <div className="w-full flex flex-col gap-2 py-4">
                <div role="list" className="w-full flex gap-2 flex-col">
                  {pages.map((page, index) => (
                    <NavLink key={index} page={page} activePath={pathname} />
                  ))}
                </div>
                <div className="divider _40px bg-neutral-300"></div>
                <div role="list" className="w-full flex gap-2 flex-col">
                  <Link
                    href={"/"}
                    className={cn(
                      "w-full cursor-pointer text-[#303350] flex flex-col items-center p-3 gap-3 text-base no-underline transition-none hover:text-[#1476ff]",
                      "/settings" === pathname && "text-[#1476ff]"
                    )}
                  >
                    <LuSettings size={25}/>
                    Settings
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      {!isMobile && <div className="w-[120px]" />}
    </>
  );
}
