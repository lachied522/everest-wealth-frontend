import type { Tables } from "./supabase";

export type StockInfo = {
    symbol: string
    name: string | null
    description: string | null
    sector: string | null
    div: number | null
    div_yield: number | null
    beta: number | null
    market_cap: number | null
    PE: number | null
    last_price: number
    change: number
    domestic: boolean
    active: boolean
}

export type PopulatedHolding = (
    Tables<'holdings'> & 
    Partial<StockInfo> & {
        weight: number
        value: number
        totalCost: number
        totalProfit: number
    }
)
export type Transaction = {
    symbol: string
    name: string
    units: number
    price: number
    brokerage: number
}

export type AdviceData = (
    Omit<Tables<'advice'>, 'transactions'|'portfolio_id'> & {
        portfolio_id: string
        transactions: Transaction[]
        value: number
        gross: number
        brokerage: number
    }
)

export type Preferences = {
    [key: string]: 'like' | 'dislike'
} | null

export type PortfolioData = (
    Omit<Tables<'portfolios'>, 'preferences'> & {
    holdings: PopulatedHolding[]
    totalValue: number
    advice: AdviceData[]
    preferences: Preferences
})

export type TimeSeriesDataPoint = {
    date: Date
    value: number
};