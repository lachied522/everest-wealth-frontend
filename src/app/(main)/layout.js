import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GlobalProvider } from "./context/GlobalState";
import { UniverseProvider } from "./context/UniverseState";
import { SidebarProvider } from "./context/SidebarState";

import { fetchStockDataFromServer } from '@/lib/redis-utils';

import Sidebar from "./sidebar";
import Header from "./header";
import Container from './container';
import Footer from './footer';

const fetchData = async (session, supabase) => {
    //fetch universe data
    const { data: universeData, error: universeError } = await supabase
    .from("universe")
    .select("symbol, tags");

    // portfolios belong to user, plus most recent record from advice table for each portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
    .from("portfolios")
    .select("*, advice(*), holdings(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { foreignTable: "advice", ascending: false })
    .limit(1, { foreignTable: "advice" });

    const { data: userData, error: userError} = await supabase
    .from("users")
    .select("watchlist")
    .eq("id", session.user.id);
    
    if(portfolioError) console.log(portfolioError);

    console.log("data fetched");

    return {
        universeData,
        portfolioData, 
        watchlistData: userData[0].watchlist,
    };
};

export default async function RootLayout({ children }) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
  
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // middleware should redirect user if session is null
        redirect('/login');
    }
  
    const { universeData, portfolioData, watchlistData } = await fetchData(session, supabase);
  
    const universeDataMap = new Map();
    universeData.forEach(stock => {
        universeDataMap.set(stock.symbol, stock);
    });

    // populate portfolios with stock data
    const populatedPortfolioData = await Promise.all(portfolioData?.map(async (portfolio) => {
        const populatedHoldings = await fetchStockDataFromServer(portfolio.holdings);

        // calculate total portfolio value
        const totalValue = populatedHoldings.reduce((acc, obj) => acc + parseFloat(obj.value), 0);
        
        return { ...portfolio, holdings: populatedHoldings, totalValue };
    }));

    // NOTE: data must be converted to JSON before passing to client
    return (
        <UniverseProvider universeDataMap={universeDataMap} >
            <GlobalProvider session={session} portfolioJSON={JSON.stringify(populatedPortfolioData)} watchlistData={watchlistData} >
                <SidebarProvider>
                    <div className="flex items-start">
                        <Sidebar />
                        <div className="flex-1">
                            <Header userName={session.user.user_metadata['name'] || 'Name'} />
                            <div className="h-full min-h-[calc(100vh-152px)] bg-white px-8 py-16">
                                <Container>
                                    {children}
                                </Container>
                            </div>
                            <Footer />
                        </div>
                    </div>
                </SidebarProvider>
            </GlobalProvider>
        </UniverseProvider>
    )
}