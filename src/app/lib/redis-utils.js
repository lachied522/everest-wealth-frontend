import { fetchSymbol } from "./redis";



export async function fetchStockDataFromServer(holdings) {
    if (!holdings) return [];
  
    const populatedHoldings = await Promise.all(holdings.map(async (holding) => {
        try {
            // check if holding is already populated
            if (holding.hasOwnProperty('last_price')) return holding;

            const data = await fetchSymbol(holding.symbol);

            const price = data.last_price;
            const value = (price * holding.units).toFixed(2);
            
            const totalCost = holding.cost? (holding.cost * holding.units).toFixed(2): 0;
            const totalProfit = ((holding.cost? (price - holding.cost): price) * holding.units).toFixed(2);
            // convert string to bool
            const domestic = data['domestic']==="True";
            const active = data['active']==="True";
    
            return { ...data, ...holding, value, totalCost, totalProfit, domestic, active };

        } catch (e) {
            return holding;
        }

    }));

    // calculate total value of portfolio for weight calculations
    const totalValue = populatedHoldings.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
    
    // add weights to array
    const populatedHoldingsWithWeight = populatedHoldings.map((holding) => ({
        ...holding,
        weight: holding.value / totalValue
    }));

    return populatedHoldingsWithWeight;
}