
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import FeaturedStocksCarousel from './featured-stocks-carousel';

import type { Database } from '@/types/supabase';

export default async function FeaturedStocksServerComponent() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

    const { data, error } = await supabase
    .from('universe')
    .select('symbol')
    .contains('tags', ['Featured']);

    return (
        <div className="max-w-[100%] overflow-auto">
            <div className="text-xl font-medium text-slate-800 my-6">Featured Stocks</div>
            <FeaturedStocksCarousel data={data || []}/>
        </div>
    )
}