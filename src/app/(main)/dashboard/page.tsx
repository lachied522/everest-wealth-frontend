import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import UserPortfolioList from "./components/user-portfolio-list";
import UserWatchlist from "./components/user-watchlist";
import FeaturedStocksCarousel from './components/featured-stocks-carousel';

import type { Database } from '@/types/supabase';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  // get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // get featured stock list
  const { data, error } = await supabase
  .from('universe')
  .select('symbol')
  .contains('tags', ['Featured']);

  return (
    <>
      <h2 className="text-2xl font-medium mb-8">
          Welcome {session!.user.user_metadata['name'] || 'Name'}
      </h2>
      <div className="flex flex-col gap-24">
        <UserPortfolioList />
        <UserWatchlist />
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">Featured Stocks</div>
            <FeaturedStocksCarousel data={data || []}/>
        </div>
      </div>
    </>
  );
};