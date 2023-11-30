export async function addStockInfoToPortfolio(holdingsData) {
    if (!holdingsData) return;
  
    const newArray = await Promise.all(holdingsData.map(async (holding) => {
        const params = new URLSearchParams({ s: holding.symbol });
        const data = await fetch(`/api/get-stock-info?${params}`).then(res => res.json());
    
        if (!data) return { ...holding };

        const price = data['last_price'];
        const value = (price * holding.units).toFixed(2);
        //const weight =  (100*(value / totalValue)).toFixed(2);
        const totalCost = holding.cost? (holding.cost * holding.units).toFixed(2): 0;
        const totalProfit = ((holding.cost? (price - holding.cost): price) * holding.units).toFixed(2);

        return { ...data, ...holding, value, price, totalCost, totalProfit };
    }));

    //calculate total value of portfolio for weight calculations
    return newArray;
}

export function addInfoToTransactions(transactions, universeDataMap) {
    if (!(transactions?.length > 0)) return [];

    const newArray = transactions.map(({ symbol, units, brokerage, price }) => {
        const value = (price * units).toFixed(2);
        const net = brokerage? (price * units - brokerage).toFixed(2): value;

        const transaction = units > 0? "BUY" : "SELL";

        const name = universeDataMap.has(symbol)? universeDataMap.get(symbol).name: "";

        return { symbol, units, brokerage, price, name, transaction, value, net};
    });

    return newArray;
}