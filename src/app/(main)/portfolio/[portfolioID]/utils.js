export async function addStockInfoToPortfolio(holdingsData) {
    if (!holdingsData) return [];
  
    const newArray = await Promise.all(holdingsData.map(async ({ id, symbol, units, cost, locked }) => {
        const params = new URLSearchParams({ s: symbol });
        const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
    
        if (!data) return { symbol, units, cost };

        const price = data['last_price'];
        const value = (price * units).toFixed(2);
        //const weight =  (100*(value / totalValue)).toFixed(2);
        const totalCost = cost? (cost * units).toFixed(2): 0;
        const totalProfit = ((cost? (price - cost): price) * units).toFixed(2);
        // convert string to bool
        const domestic = data['domestic']==="True";

        return { ...data, id, symbol, units, cost, locked, value, price, totalCost, totalProfit, domestic };
    }));

    // calculate total value of portfolio for weight calculations
    const totalValue = newArray.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
    
    const newArrayWithWeight = newArray.map((holding) => ({
        ...holding,
        weight: holding.value / totalValue
    }));

    return newArrayWithWeight;
}

export async function addInfoToTransactions(transactions) {
    if (!(transactions.length > 0)) return [];

    const newArray = await Promise.all(transactions.map(async ({ symbol, units, brokerage, price }) => {
        const params = new URLSearchParams({ s: symbol });
        const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());

        if (!data) return { symbol, units, brokerage, price };

        const value = (price * units).toFixed(2);
        const net = brokerage? (price * units - brokerage).toFixed(2): value;

        const transaction = units > 0? "Buy" : "Sell";

        const name = data['name'];

        return { symbol, units, brokerage, price, name, transaction, value, net};
    }));

    return newArray;
}