import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { LuGlobe, LuLink } from 'react-icons/lu';

import Logo from '@/components/logo';

import type { Database } from '@/types/supabase';

export default async function LandingPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="h-full">
      <div className="z-10 w-full flex items-center justify-between px-12 py-6 bg-white fixed">
          <Logo withText={true} />
          <div className="flex gap-8">
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
          <div className="flex gap-4">
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
      <div className="h-[50vh] md:h-[90vh] relative bg-gradient-to-b from-transparent from-70% to-white">
        <div className="bg-[url('/hero-background-image.jpg')] bg-cover bg-center opacity-5 absolute inset-0 -z-10 lg:bg-[center_top_25%]" />
        <div className="flex items-center justify-between gap-6 p-12 sm:6 lg:p-36 inset-y-0 absolute">
          <h1 className="basis-3/4 text-7xl font-semibold text-slate-900 drop-shadow-md">Investment Advice Shouldn&apos;t Break the Bank</h1>
          <div className="basis-1/2 flex flex-col gap-4">
            <p className="text-lg font-medium drop-shadow-md">
              Get personalised and objective investment advice and build wealth without the associated cost
            </p>
            <div className="flex items-center justify-center gap-4">
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
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-blue-300 p-36 lg:p-48">
        <div className="grid grid-cols-2 place-items-center p-16">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center">
                  <LuLink size={32} className="mr-2" />
                  <h3 className="text-2xl">Link Your Existing Broker</h3>
              </div>
              <p>Easily integrate with your existing broker account, and start receiving advice.</p>
              <Button className="mt-4">
                <a href="" className="no-underline">View Available Brokers</a>
              </Button>
            </div>
            <Image 
              src="/landing-page/iphone-transparent-background.png"
              alt="iPhone"
              width={360}
              height={360}
            />
        </div>
      </div>
      <div className="grid grid-cols-3 items-center justify-center bg-white p-24">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
                <LuGlobe size={56} className="mr-2" />
                <h3 className="text-2xl">Global Markets</h3>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
                <LuGlobe size={56} className="mr-2" />
                <h3 className="text-2xl">Stocks & ETFs</h3>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center">
                <LuGlobe size={56} className="mr-2" />
                <h3 className="text-2xl">Stocks & ETFs</h3>
            </div>
          </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white p-36 lg:p-48">
        <h2 className="text-3xl mb-4">Pricing</h2>
        <div className="grid grid-cols-3 items-center justify-center gap-6 p-16">
          <Card>
            <CardHeader>
              <div className="text-xl text-center font-medium">Plan 1</div>
            </CardHeader>
            <CardContent className="w-[360px] h-[540px] flex flex-col items-start gap-4">
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="text-xl text-center font-medium">Plan 2</div>
            </CardHeader>
            <CardContent className="w-[360px] h-[540px] flex flex-col items-start gap-4">
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="text-xl text-center font-medium">Plan 3</div>
            </CardHeader>
            <CardContent className="w-[360px] h-[540px] flex flex-col items-start gap-4">
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
