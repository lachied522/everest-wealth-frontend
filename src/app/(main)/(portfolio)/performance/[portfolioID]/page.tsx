
import { SupabaseClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import PortfolioDividendChart from "./components/portfolio-dividend-chart";
import PortfolioPerformanceChart from "./components/portfolio-performance-chart"
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";

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

function generateRandomWalk(n: number): TimeSeriesDataPoint[] {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - n + 1); // Set the start date n days ago
    const data: TimeSeriesDataPoint[] = [{ date: startDate, value: 0 }];
  
    for (let i = 1; i < n; i++) {
      const randomChange = Math.random() - 0.5; // Generate a random value between -0.5 and 0.5
      const previousValue = data[i - 1].value;
      const newValue = previousValue + randomChange;
      const newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + i);
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
  
    for (let i = 1; i < n; i+=20) {
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
    const benchmark = await getBenchmark(supabase);

    const length = 1200;
    const portfolio = generateRandomWalk(length);
    const dividends = getDividends(length);

    return (
        <>
            <div className="text-lg text-slate-700 mb-8">Performance</div>
            <div className="flex flex-col items-stretch justify-center gap-6">
                <PortfolioPerformanceChart portfolio={portfolio} benchmark={benchmark} />
                <PortfolioDividendChart data={dividends} />
            </div>
        </>
    )
}