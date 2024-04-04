
import { createServerComponentClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { getPerformance, getBenchmark } from "./utils/get-performance";

import PerformanceTabs from "./components/performance-tabs";

import type { Database } from "@/types/supabase";

type TimeSeriesDataPoint = {
    date: Date
    value: number
};

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

    const [performance, benchmark] = await Promise.all([
        getPerformance(portfolioID, supabase),
        getBenchmark()
    ]);

    const dividends = getDividends(1200);

    return (
        <PerformanceTabs
            performance={performance}
            benchmark={benchmark}
            dividends={dividends}
        />
    )
}