import { fetchSymbol } from "./redis";

import type { Tables } from "@/types/supabase";
import type { PopulatedHolding } from "@/types/types";

export async function fetchStockDataFromServer(holdings: Tables<'holdings'>[]) {

    if (!holdings) return [];
  
    const populatedHoldings = await Promise.all(holdings.map(async (holding) => {
        try {
            // check if holding is already populated
            if (holding.hasOwnProperty('last_price')) return holding;

            const data = await fetchSymbol(holding.symbol);

            if (!data) return {
                ...holding,
                value: 0,
                totalProfit: 0
            }

            const price = data.last_price;
            const value = (price * holding.units);
            
            const totalCost = holding.cost? (holding.cost * holding.units): 0;
            const totalProfit = ((holding.cost? (price - holding.cost): price) * holding.units);

            const totalDiv = data.div? data.div * holding.units: 0;

            const EPSgrowth = data.forward_EPS && data.trailing_EPS ? data.forward_EPS > 0 && data.trailing_EPS > 0 ? data.forward_EPS / data.trailing_EPS - 1: 'NM': NaN;
    
            return { 
                ...data,
                ...holding,
                value,
                totalCost,
                totalProfit,
                totalDiv,
                EPSgrowth
            };

        } catch (e) {
            return holding;
        }
    }));

    // calculate total value of portfolio for weight calculations
    const totalValue = populatedHoldings.reduce((acc, obj) => (
        acc + ('value' in obj? obj.value: 0)
    ), 0);
    
    // add weights to array
    const populatedHoldingsWithWeight = populatedHoldings.map((obj) => ({
        ...obj,
        weight: 'value' in obj? obj.value / totalValue: 0
    }));

    return populatedHoldingsWithWeight as PopulatedHolding[];
}