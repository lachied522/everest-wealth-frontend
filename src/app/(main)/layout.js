import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

import { GlobalProvider } from '@/context/GlobalState';
import { UniverseProvider } from "@/context/UniverseState";
import { SidebarProvider } from '@/context/SidebarState';

import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

const fetchData = async (session, supabase) => {
    if (!session) return [];
    //fetch universe data
    const { data: universeData, error: universeError } = await supabase
    .from("universe")
    .select("id, symbol, name, sector, div_yield, beta, market_cap, last_price, domestic");

    //fetch user data
    const { data: userData, error: userError } = await supabase
    .from("users")
    .select("portfolios!portfolios_user_id_fkey(id, name, objective, data), profiles!users_profile_fkey(*), advice(*)")
    .eq("id", session.user.id);
    
    if (userError) console.log(userError);
    console.log("data fetched");
  
    return [
      userData[0], 
      universeData
    ];    
}

export default async function RootLayout({ children }) {
    const supabase = createServerComponentClient({ cookies });
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    const [userData, universeData] = await fetchData(session, supabase);
  
    //tag any current recommendations with 'current'
    // for (const rec of userData['advice']) {
    //   if (checkDate(rec.created_at) && !rec.actioned) {
    //     rec['current'] = true;
    //     break;
    //   }
    // }

    const universeDataMap= new Map();
    universeData.forEach(stock => {
        universeDataMap.set(stock.symbol, stock);
    });

    // calculate total portfolio values
    
  
    return (
        <GlobalProvider session={session} userData={userData} universeData={universeData} >
            <UniverseProvider universeDataMap={universeDataMap} >
                <SidebarProvider>
                    <div className="dashboard-main">
                        <Sidebar />
                        <div className="dashboard-content">
                            <Header currentPage={"Portfolio"} />
                            <div className="dashboard-main-content">
                                {children}
                            </div>
                        </div>
                    </div>
                </SidebarProvider>
            </UniverseProvider>
        </GlobalProvider>
    )
}