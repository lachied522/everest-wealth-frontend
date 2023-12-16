"use client";
import { useMemo } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";

import { LuBell } from "react-icons/lu";

import { GlobalState, useGlobalContext } from "./context/GlobalState";
import Link from "next/link";

export default function NotificiationMenu() {
    const { notifications } = useGlobalContext() as GlobalState;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="h-4 w-4 flex items-center justify-center relative">
                    {notifications.length > 0 && <div className="absolute flex top-0 right-0 rounded-full h-2 w-2 bg-red-300" />}
                    <LuBell size={18} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[180px]">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification, index) => (
                    <DropdownMenuItem key={index}>
                        <Link href={notification.href} className="text-slate-600 no-underline">
                            {notification.msg}
                        </Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}