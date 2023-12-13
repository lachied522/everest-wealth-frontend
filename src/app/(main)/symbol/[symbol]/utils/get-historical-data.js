
function parseCSV(text) {
    const rows = text.trim().split('\n');
    const headings = rows[0];
    console.log(headings);
    return rows.slice(1).map((row) => {
        const data = row.trim().split(',');
        
    });
}

export default async function GetHistoricalData(symbol) {
    const url = `https://query1.finance.yahoo.com/v7/finance/download/${symbol}?period1=1669994371&period2=1701530371&interval=1d&events=history&includeAdjustedClose=true`;

    return await fetch(url).then(res => res.text()).then(data => console.log(parseCSV(data)));

}