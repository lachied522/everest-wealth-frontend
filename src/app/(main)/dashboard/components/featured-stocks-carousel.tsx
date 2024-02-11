"use client";
import { useState } from "react";

import StockCard from "./stock-card";

interface FeaturedStocksCarouselProps {
    data: {
        symbol: string
    }[]
}

export default function FeaturedStocksCarousel({ data }: FeaturedStocksCarouselProps) {
    const [startIndex, setStartIndex] = useState(0); //

    return (
        <div className="flex items-stretch gap-6">
            {data.slice(startIndex, startIndex+3).map((stock, index) => (
                <StockCard key={`featured-${index}`} symbol={stock.symbol} />
            ))}
        </div>
    )
}