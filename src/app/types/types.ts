import type { Tables } from "./supabase";

export type UserMetaData = {
    name?: string
    DOB?: string
}

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
    trailing_EPS: number | null
    forward_EPS: number | null
    EPSgrowth: number | null
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
        totalProfit: number // value - totalCost
        totalDiv: number // units x dividend
    }
)
export type Transaction = {
    symbol: string
    name: string
    units: number
    price: number
    brokerage: number
    status?: string
}

export type AdviceData = (
    Omit<Tables<'advice'>, 'transactions'> & {
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
    Omit<Tables<'portfolios'>, 'item_access_token'|'preferences'> & {
    totalValue: number
    holdings: PopulatedHolding[]
    advice: AdviceData[]
    item_access_token: boolean
    preferences: Preferences
})

export type TimeSeriesDataPoint = {
    date: Date
    value: number
};