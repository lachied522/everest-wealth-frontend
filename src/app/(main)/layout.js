import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { GlobalProvider } from "./context/GlobalState";
import { UniverseProvider } from "./context/UniverseState";
import { SidebarProvider } from "./context/SidebarState"

import Sidebar from "./sidebar";
import Header from "./header";

const fetchData = async (session, supabase) => {
    //fetch universe data
    const { data: universeData, error: universeError } = await supabase
    .from("universe")
    .select("id, symbol, name, sector, div_yield, beta, market_cap, last_price, domestic");

    // portfolios belong to user, plus most recent record from advice table for each portfolio
    const { data: userData, error: userError } = await supabase
    .from("portfolios")
    .select("*, advice(*), holdings(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { foreignTable: "advice", ascending: false })
    .limit(1, { foreignTable: "advice" });
    
    if(userError) console.log(userError);

    console.log("data fetched");

    return [
      userData, 
      universeData
    ];    
}

export default async function RootLayout({ children }) {
    const supabase = createServerComponentClient({ cookies });
  
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // middleware should redirect user if session is null
    }
  
    const [userData, universeData] = await fetchData(session, supabase);
  
    const universeDataMap = new Map();
    universeData.forEach(stock => {
        universeDataMap.set(stock.symbol, stock);
    });

    // calculate total portfolio values
    const updatedUserData = userData?.map((portfolio) => {
        let totalValue = 0;
        portfolio.holdings?.forEach(holding => {
            if (universeDataMap.has(holding.symbol)) {
                const price = universeDataMap.get(holding.symbol).last_price;
                totalValue += price * holding.units;
            }
        });
        return { ...portfolio, totalValue: totalValue };
    });

    return (
        <UniverseProvider universeDataMap={universeDataMap} >
            <GlobalProvider session={session} userData={updatedUserData} universeDataMap={universeDataMap} >
                <SidebarProvider>
                    <div className="flex items-start">
                        <Sidebar />
                        <div className="flex-1">
                            <Header currentPage={"Portfolio"} userName={session.user.user_metadata['name'] || 'Name'} />
                            <div className="h-full px-8 py-16">
                                {children}
                            </div>
                        </div>
                    </div>  
                </SidebarProvider>
            </GlobalProvider>
        </UniverseProvider>
    )
}