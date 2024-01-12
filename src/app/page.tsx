import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';

import { LuCandlestickChart, LuFileLineChart, LuLink, LuUser2 } from 'react-icons/lu';

import Logo from '@/components/logo';

import type { Database } from '@/types/supabase';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="h-full">
      <div className="flex items-center justify-between px-12 py-6">
          <Logo withText={true} />
          <div className="flex gap-5">
              <Link href='/' className="text-base text-slate-700 no-underline">
                Features
              </Link>
              <Link href='/' className="text-base text-slate-700 no-underline">
                Pricing
              </Link>
              <Link href='/' className="text-base text-slate-700 no-underline">
                Resources
              </Link>
          </div>
          {session ? (
          <Link href='/dashboard'>
            <Button>
              Dashboard
            </Button>
          </Link>
          ) : (
          <div className="flex gap-2">
            <Link href='/login'>
              <Button variant="secondary">
                Login
              </Button>
            </Link>
            <Link href='/signup'>
              <Button>
                Signup
              </Button>
            </Link>
          </div>
          )}
      </div>
      <div className="h-[50vh] md:h-[75vh] relative bg-gradient-to-b from-transparent from-70% to-white">
        <div className="bg-[url('/hero-background-image.jpg')] bg-cover bg-center absolute inset-0 opacity-80 -z-10 lg:bg-[center_top_25%]" />
        <div className="flex flex-col items-center justify-center gap-3 p-12 sm:6 lg:p-36">
          <h1 className="text-white drop-shadow-md">Investment Advice Shouldn't Break the Bank</h1>
          <p className="text-white text-lg font-medium drop-shadow-md">
            Get personalised and objective investment advice and build wealth without the associated cost
          </p>
          <div className="flex gap-2 p-6">
            {session ? (
            <Link href='/dashboard'>
              <Button variant="secondary">
                Dashboard
              </Button>
            </Link>
            ) : (
            <>
              <Link href='/login'>
                <Button variant="secondary">
                  Login
                </Button>
              </Link>
              <Link href='/signup'>
                <Button>
                  Signup
                </Button>
              </Link>
            </>
            )}
          </div>
          <div className="hidden bg-white rounded-md p-8 absolute -bottom-[20%] md:block">
            <div className="w-[38vw] min-w-[540px] h-[calc(38vw*0.55)] min-h-[calc(540px*0.55)] relative">
              <Image alt="Hero Image" src="/hero-section-image.jpg" fill />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white p-36 lg:p-48">
        <div className="flex items-center justify-center p-16">
            <div className="w-[50%] flex flex-wrap gap-6">
                <div className="flex items-center text-base text-slate-800 font-semibold">
                  <LuUser2 size={32} className="mr-2" />
                  Personalised Investment Advice
                </div>
                <div className="flex items-center text-base text-slate-800 font-semibold">
                  <LuLink size={32} className="mr-2" />
                  Link Your Existing Broker
                </div>
                <div className="flex items-center text-base text-slate-800 font-semibold">
                  <LuCandlestickChart size={32} className="mr-2" />
                  International Equities and ETFs
                </div>
                <div className="flex items-center text-base text-slate-800 font-semibold">
                  <LuFileLineChart size={32} className="mr-2" />
                  Performance and Income Reporting
                </div>
            </div>
        </div>
      </div>
    </main>
  )
}
