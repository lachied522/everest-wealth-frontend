import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';

import { LuLink } from 'react-icons/lu';

import Logo from './logo';
import Footer from './footer';

import type { Database } from '@/types/supabase';

export default async function Home() {
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
              {/* <Link href='/' className="text-base text-slate-700 no-underline">
                Features
              </Link>
              <Link href='/' className="text-base text-slate-700 no-underline">
                Pricing
              </Link>
              <Link href='/' className="text-base text-slate-700 no-underline">
                Resources
              </Link> */}
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
                Try Free
              </Button>
            </Link>
          </div>
          )}
      </div>
      <div className="h-[50vh] md:h-[90vh] relative bg-gradient-to-b from-transparent from-70% to-white">
        <div className="bg-[url('/landing-page/hero-background-image.jpg')] bg-cover bg-center opacity-[0.32] absolute inset-0 -z-10 lg:bg-[center_top_25%]" />
        <div className="grid grid-cols-1 xl:grid-cols-2 items-center justify-items-center p-36 xl:p-56 inset-y-0 absolute">
          <h1 className="text-5xl font-semibold text-slate-900 drop-shadow-md lg:text-7xl">Investment Advice Shouldn&apos;t Break the Bank</h1>
          <div className="max-w-[60%] flex flex-col items-center justify-center gap-6">
            <p className="text-lg font-medium drop-shadow-md">
              Everest Wealth is bridging the gap between costly financial advice and those who need it the most.
            </p>
            <div className="flex items-center justify-center gap-6">
              {session ? (
              <Link href='/dashboard'>
                <Button>
                  Dashboard
                </Button>
              </Link>
              ) : (
              <>
                <Link href='/login'>
                  <Button variant="secondary" className="shadow-sm">
                    Login
                  </Button>
                </Link>
                <Link href='/signup'>
                  <Button className="shadow-sm">
                    Try Free
                  </Button>
                </Link>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white px-24 lg:px-36 py-36">
        <h2 className="text-3xl font-medium mb-24">The Problem</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl text-center">Market Gap</h3>
              <p>Only 11.2% of Australians have a financial adviser, yet 60% percent of believe they could benefit from receiving advice.<sup>1</sup></p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl text-center">Generations Missing Out</h3>
              <p>Only 4 percent of Millennials and Gen Z receive financial advice, however they stand to benefit the most.<sup>1</sup></p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl text-center">Barriers to Entry</h3>
              <p>Number one barrier to seeking financial advice is cost, with the median fee at $3,256 p.a.<sup>1</sup></p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl text-center">Increasing Costs</h3>
              <p>Costs are only going up as 13,000 advisers have left the industry since 2019.<sup>1,2</sup></p>
            </div>
        </div>
        <ol className="list-decimal">
          {[
            "https://www.afr.com/wealth/personal-finance/how-to-get-financial-advice-without-forking-out-3000-20210419-p57kcu",
            "https://www.ifa.com.au/news/29479-adviser-numbers-to-plummet-by-30"
          ].map((ref, index) => (
          <li key={`list-item-${index}`} className="text-xs mb-1">
            <a href={ref} className="text-blue-600 underline">{ref}</a>
          </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-center justify-center bg-blue-300 px-24 py-48 lg:px-36 gap-24">
        <h2 className="text-3xl font-medium mb-24">The Solution</h2>
        <div className="grid grid-cols-[repeat(2,90px_1fr)] items-center justify-items-center px-48 gap-12 mb-12">
            <Image 
              src="/landing-page/investment-icon.png"
              alt="Investment"
              width={75}
              height={75}
            />
            <p className="text-lg">A platform that provides both passive and on-demand, personal investment advice.</p>
              <Image 
                src="/landing-page/tablet-icon.png"
                alt="Tablet Screen"
                width={78}
                height={78}
              />
            <p className="text-lg">Users can stay involved in managing their investments, or not!</p>
              <Image 
                src="/landing-page/affordable-icon.png"
                alt="Affordable"
                width={88}
                height={88}
              />
            <p className="text-lg">Quicker and more affordable than a traditional adviser.</p>
              <Image 
                src="/landing-page/hand-shake.png"
                alt="Handshake"
                width={88}
                height={88}
              />
            <p className="text-lg">No conflicts of interest associated with traditional advisers.</p>
        </div>
      </div>
      <div className="bg-white p-36">
        <div className="grid grid-cols-2 place-items-center">
          <div className="max-w-[60%] flex flex-col items-start gap-4">
            <div className="flex items-center">
                <LuLink size={32} className="mr-2" />
                <h3 className="text-2xl">Link Your Existing Broker</h3>
            </div>
            <p className="text-lg">We are not a broker! We integrate with your existing accounts, so it&apos;s easy to get started.</p>
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
      <div className="flex flex-col items-center justify-center bg-white px-24 lg:px-36 py-36">
        <div className="max-w-[60%] flex flex-col text-center gap-4 mb-24">
          <h2 className="text-3xl font-medium">Where We Sit</h2>
          <p className="text-lg">We aim to provide the same personalised investment experience as a full-service adviser at the cost of a discount broker.</p>
        </div>
        <Image 
          src="/landing-page/where-we-sit.png"
          alt="iPhone"
          width={800}
          height={465}
        />
      </div>
      <div className="bg-white p-56">
        <div className="grid grid-cols-2 place-items-center">
          <div className="max-w-[60%] flex flex-col items-center gap-6">
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="text-3xl font-medium">Start Receiving Advice for Free</h2>
              <p className="text-lg">No credit card required.</p>
            </div>
            <div className="flex gap-4">
              <Link href='/login'>
                <Button variant="secondary">
                  Login
                </Button>
              </Link>
              <Link href='/signup'>
                <Button>
                  Try Free
                </Button>
              </Link>
            </div>
          </div>
          <Image 
            src=""
            alt="Compound returns on investment"
            width={100}
            height={100}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}
