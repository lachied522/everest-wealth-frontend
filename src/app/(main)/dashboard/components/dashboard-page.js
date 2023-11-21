"use client";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";


import { LuPlus } from "react-icons/lu";

import NewPortfolioPopup from "./new-portfolio-popup";
import UserPortfolioList from "./user-portfolio-list";
import UserWatchlist from "./user-watchlist";
import FeaturedList from "./featured-list";

export default function DashboardPage() {
    return (
        <>
            <div className="mb-8">
            <div className="flex items-center justify-between">
                <div className="text-xl font-medium text-slate-800 mb-0">
                    My Portfolios
                </div>
                <NewPortfolioPopup />
            </div>
            </div>
            <UserPortfolioList />
            <UserWatchlist />
            <FeaturedList />
        </>
    );
}
