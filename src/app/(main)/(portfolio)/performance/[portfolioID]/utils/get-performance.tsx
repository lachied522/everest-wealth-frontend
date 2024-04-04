import yf from 'yahoo-finance2';

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Tables } from '@/types/supabase';
import type { ResolvedPromise, TimeSeriesDataPoint } from "@/types/types";


async function fetchPortfolioAndTransactions(
    portfolioID: string,
    supabase: SupabaseClient<Database>,
) {
    // get portfolio holdings and transactions from DB
    const { data, error } = await supabase
        .from('portfolios')
        .select('holdings(*), transactions(*)')
        .eq('id', portfolioID);

    if (error) throw new Error(`Error fetching portfolio: ${error}`);
    
    return data[0];
}

async function getStockPriceHistory(
    symbol: string,
    length: number = 12, // length in months to fetch 
    interval: "1d"|"5d"|"1mo" = "1d"
): Promise<TimeSeriesDataPoint[] | undefined> {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - length);

    let res;
    try {
        // majority of symbols on ASX have 3 characters, need '.AX' suffix
        const formattedSymbol = symbol.length===3? symbol.toUpperCase() + '.AX': symbol.toUpperCase();
        res = await yf.chart(formattedSymbol, {
            period1: startDate,
            interval,

        });

        if (res) {
            return res.quotes.map((data) => ({ date: data.date, value: data.close }));
        }
    } catch (e) {
        // check if symbol exists without suffix
        console.log(`Error fetching price data for ${symbol}`, e);
    }
}

async function calculatePortfolioPerformance(
    holdingAndTransactionData: ResolvedPromise<ReturnType<typeof fetchPortfolioAndTransactions>>, 
    length: number = 12
) {
    let summedPortfolioData: TimeSeriesDataPoint[] = [];

    await Promise.all(
        holdingAndTransactionData.holdings.map(async (holding) => {
            const priceHistory = await getStockPriceHistory(holding.symbol);

            if (priceHistory) {
                if (!summedPortfolioData.length) {
                    // initiliase summed portfolio data to the current stock data
                    summedPortfolioData = priceHistory.map((obj, _) => ({ date: obj.date, value: (obj.value || 0) * holding.units }));
                } else {
                    priceHistory.forEach((obj, index) => {
                        try {
                            const currentValue = summedPortfolioData[index].value;
                            summedPortfolioData[index].value = currentValue! + (obj.value || 0) * holding.units; 
                        } catch (e) {
                            // pass
                        }
                    });
                }
            }
        })
    )

    return summedPortfolioData;
}

export async function getPerformance(
    portfolioID: string,
    supabase: SupabaseClient<Database>,
    length: number = 12
): Promise<TimeSeriesDataPoint[] | undefined> {
    const holdingAndTransactionData = await fetchPortfolioAndTransactions(portfolioID, supabase);
    return calculatePortfolioPerformance(holdingAndTransactionData);
}

export async function getBenchmark(length: number = 12): Promise<TimeSeriesDataPoint[] | undefined> {
    const benchmark = 'ACWI'; // symbol for MSCI All World Index
    return getStockPriceHistory(benchmark, length);
}