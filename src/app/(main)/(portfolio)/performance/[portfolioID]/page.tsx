
import { createServerComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import PerformanceTabs from "./components/performance-tabs";

import type { Database } from "@/types/supabase";

type TimeSeriesDataPoint = {
    date: Date
    value: number
};

async function getBenchmark(supabase: SupabaseClient): Promise<TimeSeriesDataPoint[]> {
    const { data, error } = await supabase
        .from('snapshots')
        .select('date, value')
        .eq('portfolio_id', '7f41bdd2-00f5-43ab-a7b4-05feae4ba036');
    
    if (!error) {
        // convert date column to Date object
        return data.map((obj) => ({
            ...obj,
            date: new Date(obj.date)
        }));
    } else {
        console.log(error);
    }

    return []
}

async function getPerformance({ supabase, portfolioID, n } : {
    supabase: SupabaseClient
    portfolioID: string
    n: number
}): Promise<TimeSeriesDataPoint[]> {
    // get portfolio from DB
    const { data: snapshots, error } = await supabase
        .from('snapshots')
        .select('date, value')
        .eq('portfolio_id', portfolioID)
        .order('date', { ascending: false });

    // use Random Walk to simulate performance data
    const endValue = snapshots? snapshots[0].value: 10000;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - n + 1); // Set the start date n days ago
    const data: TimeSeriesDataPoint[] = [{ date: startDate, value: endValue }];
  
    for (let i = 1; i < n; i++) {
      const randomChange = 2*Math.random() - 1; // Generate a random value between -1 and 1
      const previousValue = data[i - 1].value;
      const newValue = previousValue * (1 + randomChange/100);
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() - i);
      data.push({ date: newDate, value: newValue });
    }
  
    return data;
}

type DividendDataPoint = {
    date: Date
    value: number
}

function getDividends(n: number): DividendDataPoint[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - n + 1); // Set the start date n days ago
    const data: TimeSeriesDataPoint[] = [{ date: startDate, value: 0 }];
  
    for (let i = 1; i < n; i+=100) {
      const randomAmount = 100*Math.random(); // Generate a random value between 0 and 100
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
      data.push({ date: newDate, value: randomAmount });
    }
  
    return data;
}

interface PageProps {
    params: {
      portfolioID: string
    }
}

export default async function PerformancePage({ params }: PageProps) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

    const portfolioID = params.portfolioID;

    const length = 1200;
    const [performance, benchmark] = await Promise.all([
        getPerformance({ portfolioID, supabase, n: length }),
        getBenchmark(supabase)
    ])

    const dividends = getDividends(length);

    return (
        <PerformanceTabs
            performance={performance}
            benchmark={benchmark}
            dividends={dividends}
        />
    )
}