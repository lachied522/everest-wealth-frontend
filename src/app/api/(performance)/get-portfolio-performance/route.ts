import yf from 'yahoo-finance2';

import type { SupabaseClient } from "@supabase/supabase-js";

import type { TimeSeriesDataPoint } from "@/types/types";


function getTodayDate() {
    let today = new Date();
    return today.toISOString().split('T')[0];
}

async function getStockPriceHistory(
    symbol: string,
    length: number = 12, // length in months to fetch 
    interval: "1d"|"5d"|"1mo" = "5d"
) {
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - length);

    let res;
    try {
        res = await yf.chart(symbol, {
            period1: startDate,
            interval,
        });

    } catch (e) {
        console.log(`Error fetching price data for ${symbol}`, e);
    }

    if (res) {
        return res.quotes.map((data) => ({ date: data.date, value: data.close }));
    }
}

export async function getPerformance(
    portfolioID: string,
    supabase: SupabaseClient,
    length: number = 12
) {
    // get portfolio from DB
    // const { data: snapshots, error } = await supabase
    //     .from('snapshots')
    //     .select('date, value')
    //     .eq('portfolio_id', portfolioID)
    //     .order('date', { ascending: false });

    return getStockPriceHistory('ACWI');
}

export async function getBenchmark(length: number = 12) {
    const benchmark = 'ACWI'; // symbol for MSCI All World Index
    return getStockPriceHistory(benchmark, length);
}