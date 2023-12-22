"use client";
import { useState } from "react";

import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LuArrowRightCircle, LuArrowLeftCircle } from "react-icons/lu";

import StockCard from "./stock-card";

interface FeaturedStocksCarouselProps {
    data: {
        symbol: string | null
    }[]
}

export default function FeaturedStocksCarousel({ data }: FeaturedStocksCarouselProps) {
    const [startIndex, setStartIndex] = useState(0); //

    return (
        <div className="flex items-stretch gap-6">
            {data.slice(startIndex, startIndex+3).map((stock, index) => (
                <>
                    {stock.symbol && <StockCard key={`featured-${index}`} symbol={stock.symbol} />}
                </>
            ))}
        </div>
    )
}