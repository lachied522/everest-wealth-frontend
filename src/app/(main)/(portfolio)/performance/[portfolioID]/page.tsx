
import PortfolioDividendChart from "./components/portfolio-dividend-chart";
import PortfolioPerformanceChart from "./components/portfolio-performance-chart"

type TimeSeriesDataPoint = {
    date: Date
    value: number
};

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

export default function PerformancePage({ params }: PageProps) {
    const length = 1200;
    const performance = generateRandomWalk(length);
    const dividends = getDividends(length);


    return (
        <>
            <div className="text-lg text-slate-700">Performance</div>
            <div className="flex flex-col items-center justify-center gap-6">
                <PortfolioPerformanceChart data={performance} />
                <PortfolioDividendChart data={dividends} />
            </div>
        </>
    )
}