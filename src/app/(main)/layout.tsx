import { createServerComponentClient, Session, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchStockDataFromServer } from '@/lib/redis-utils';

import { GlobalProvider } from "@/context/GlobalState";
import { SidebarProvider } from "@/context/SidebarState";
import { PortfolioProvider } from "@/context/PortfolioState";

import Sidebar from "./sidebar";
import Header from "./header";
import Container from './container';
import Footer from './footer';
import AICompanion from '@/components/ai-companion/ai-companion';

import type { Database, Tables } from '@/types/supabase';

type RawPortfolioData = Tables<'portfolios'> & {
    holdings: Tables<'holdings'>[]
    advice: Tables<'advice'>[]
}

type FormattedPortfolioData = Omit<RawPortfolioData, 'item_access_token'> & {
    item_access_token: boolean
}

const formatData = (data: RawPortfolioData[] | null): FormattedPortfolioData[] => {
    if (!data) return [];
    // item_access token must be remove before sending to client
    return data?.map((obj) => ({
        ...obj,
        item_access_token: !!obj.item_access_token
    }))
}

const fetchData = async (
    session: Session,
    supabase: SupabaseClient<Database>
): Promise<{
    portfolioData: FormattedPortfolioData[]
    userData: {
        watchlist: string[]
        notifications: any
    }
}> => {
    try {
        const { data: portfolioData, error: portfolioError } = await supabase
        .from("portfolios")
        .select("*, holdings(*), advice(*, recom_transactions(*))")
        .eq("user_id", session.user.id)
        .order("created_at", { referencedTable: "advice", ascending: false })
        .limit(1, { referencedTable: "advice" });

        const formattedData = formatData(portfolioData);

        const { data: userData, error: userError} = await supabase
        .from("users")
        .select("watchlist, notifications")
        .eq("id", session.user.id);
        
        if(portfolioError || userError) {
            console.log(portfolioError);
            throw new Error(`Error fecthing data ${portfolioError}`);
        };

        console.log("data fetched");

        return {
            portfolioData: formattedData,
            userData: {
                watchlist: userData[0].watchlist,
                notifications: userData[0].notifications
            }
        };

    } catch (e) {
        console.log(e);

        return {
            portfolioData: [], 
            userData: {
                watchlist: [],
                notifications: []
            }
        };
    }
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
                <PortfolioProvider>
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
                    <AICompanion />
                </PortfolioProvider>
            </SidebarProvider>
        </GlobalProvider>
    )
}