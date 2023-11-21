export function addStockInfoToPortfolio(portfolioData, universeDataMap) {
    if (!portfolioData) return;
  
    //calculate total value of portfolio for weight calculations
    //const totalValue = portfolioData.reduce((acc, obj) => acc + parseFloat(obj.price * obj.units), 0);
  
    const newArray = portfolioData.map(({ id, symbol, units, cost, locked }) => {
        if (!universeDataMap.has(symbol)) return { id, symbol, units, cost };
        const price = universeDataMap.get(symbol).last_price;
  
        const value = (price * units).toFixed(2);
        //const weight =  (100*(value / totalValue)).toFixed(2);
        const totalCost = cost? (cost * units).toFixed(2): 0;
        const totalProfit = ((cost? (price - cost): price) * units).toFixed(2);
  
        return { ...universeDataMap.get(symbol), id, symbol, units, cost, locked, value, price, totalCost, totalProfit };
    });
  
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