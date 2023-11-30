import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { GlobalProvider } from "./context/GlobalState";
import { UniverseProvider } from "./context/UniverseState";
import { SidebarProvider } from "./context/SidebarState";

import { fetchSymbol } from '../lib/redis';

import Sidebar from "./sidebar";
import Header from "./header";
import Container from './container';
import Footer from './footer';

const fetchData = async (session, supabase) => {
    //fetch universe data
    const { data: universeData, error: universeError } = await supabase
    .from("universe")
    .select("id, symbol, name, sector, div_yield, beta, market_cap, last_price, domestic, tags");

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
    const supabase = createServerComponentClient({ cookies });
  
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // middleware should redirect user if session is null
    }
  
    const { universeData, portfolioData, watchlistData } = await fetchData(session, supabase);
  
    const universeDataMap = new Map();
    universeData.forEach(stock => {
        universeDataMap.set(stock.symbol, stock);
    });

    // calculate total portfolio values
    const updatedPortfolioData = await Promise.all(portfolioData?.map(async (portfolio) => {
        let totalValue = 0;
        await Promise.all(portfolio.holdings?.map(async (holding) => {
            return fetchSymbol(holding.symbol)
                .then(data => {
                    totalValue += data['last_price'] * holding.units || 0;
                });
        }));
        
        return { ...portfolio, totalValue };
    }));
    
    return (
        <UniverseProvider universeDataMap={universeDataMap} >
            <GlobalProvider session={session} portfolioData={updatedPortfolioData} watchlistData={watchlistData} universeDataMap={universeDataMap} >
                <SidebarProvider>
                    <div className="flex items-start">
                        <Sidebar />
                        <div className="flex-1">
                            <Header userName={session.user.user_metadata['name'] || 'Name'} />
                            <div className="h-full px-8 py-16">
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