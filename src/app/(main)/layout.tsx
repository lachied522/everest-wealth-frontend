import { createServerComponentClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { GlobalProvider } from "./context/GlobalState";
import { SidebarProvider } from "./context/SidebarState";

import { fetchStockDataFromServer } from '@/lib/redis-utils';

import Sidebar from "./sidebar";
import Header from "./header";
import Container from './container';
import Footer from './footer';

import { Database } from '@/types/supabase';

const fetchData = async (session: Session, supabase: SupabaseClient) => {
    // portfolios belong to user, plus most recent record from advice table for each portfolio
    const { data: portfolioData, error: portfolioError } = await supabase
    .from("portfolios")
    .select("*, advice(*), holdings(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { foreignTable: "advice", ascending: false })
    .limit(1, { foreignTable: "advice" });

    const { data: userData, error: userError} = await supabase
    .from("users")
    .select("watchlist, notifications")
    .eq("id", session.user.id);
    
    if(portfolioError || userError) {
        console.log(`Error fecthing data`);
        throw new Error(`Error fecthing data ${portfolioError}`);
    };

    console.log("data fetched");

    return {
        portfolioData: portfolioData || [], 
        userData: {
            watchlist: userData[0].watchlist || [],
            notifications: JSON.parse(userData[0].notifications) || []
        }
    };
};

export default async function RootLayout({ children } : { children: React.ReactNode}) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });
  
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        // middleware should redirect user if session is null
        redirect('/login');
    }
  
    const { portfolioData, userData } = await fetchData(session, supabase);

    // populate portfolios with stock data
    const populatedPortfolioData = await Promise.all(
        portfolioData.map(
            async (portfolio) => {
                const populatedHoldings = await fetchStockDataFromServer(portfolio.holdings);

                // calculate total portfolio value
                const totalValue = populatedHoldings.reduce((acc, obj) => acc + obj.value, 0);
                
                return { ...portfolio, holdings: populatedHoldings, totalValue };
            }
        )
    );

    // NOTE: data must be converted to JSON before passing to client
    return (
        <GlobalProvider session={session} portfolioJSON={JSON.stringify(populatedPortfolioData)} userData={userData} >
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
    )
}