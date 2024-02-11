import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

import { Button } from '@/components/ui/button';

import { LuLink } from 'react-icons/lu';

import Logo from './logo';
import Footer from './footer';
import DemoLoginButton from './demo-login-button';

import type { Database } from '@/types/supabase';

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient<Database>({ cookies: () => cookieStore });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="h-full">
      <div className="z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 px-12 py-6 bg-white fixed">
        <Logo withText={true} />
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
          <DemoLoginButton />
        </div>
        )}
      </div>
      <div className="h-[90vh] relative bg-gradient-to-b from-transparent from-70% to-white">
        <div className="bg-[url('/landing-page/hero-background-image.jpg')] bg-cover bg-center opacity-[0.32] absolute inset-0 -z-10 lg:bg-[center_top_25%]" />
        <div className="flex items-center justify-center px-6 sm:px-24 2xl:px-48 inset-y-0 absolute">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-items-center mt-16">
            <h1 className="text-5xl font-semibold text-slate-900 drop-shadow-md lg:text-7xl mb-12">
              Investment Advice Shouldn&apos;t Break the Bank
            </h1>
            <div className="max-w-[480px] flex flex-col items-center justify-center gap-6">
              <p className="text-xl font-medium drop-shadow-md">
                Pocket Adviser is bridging the gap between costly investment advice and those who need it the most.
                <br />
                <br />
                We are the young Australian&apos;s guide to investing in the ASX.
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
                  <DemoLoginButton />
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white px-6 sm:px-24 lg:px-36 py-24 sm:py-36">
        <h2 className="text-4xl font-bold mb-24">The Problem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-24">
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
              <p>Number one barrier to seeking financial advice is cost, with the median fee at $3,500 p.a.<sup>2</sup></p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-2xl text-center">Increasing Costs</h3>
              <p>Costs are only going up as 13,000 advisers have left the industry since 2019.<sup>2,3</sup></p>
            </div>
        </div>
        <ol className="list-decimal">
          {[
            "https://www.afr.com/wealth/personal-finance/how-to-get-financial-advice-without-forking-out-3000-20210419-p57kcu",
            "https://asic.gov.au/about-asic/news-centre/find-a-media-release/2023-releases/23-302mr-gen-z-more-concerned-about-finances-than-any-generation-in-australia/",
            "https://www.ifa.com.au/news/29479-adviser-numbers-to-plummet-by-30",
          ].map((ref, index) => (
          <li key={`list-item-${index}`} className="text-xs mb-1">
            <a href={ref} className="text-blue-600 underline">{ref}</a>
          </li>
          ))}
        </ol>
      </div>
      <div className="flex flex-col items-center justify-center bg-blue-300 px-6 sm:px-12 lg:px-36 py-24 sm:py-36 gap-24">
        <h2 className="text-4xl font-bold lg:mb-24">The Solution</h2>
        <div className="max-w-[900px] grid grid-cols-[75px_1fr] sm:grid-cols-[repeat(2,90px_1fr)] items-center justify-items-center gap-12 mb-12">
            <Image 
              src="/landing-page/investment-icon.png"
              alt="Investment"
              width={75}
              height={75}
            />
            <p className="text-lg">A mobile & web app that provides both passive and on-demand investment advice.</p>
              <Image 
                src="/landing-page/tablet-icon.png"
                alt="Tablet Screen"
                width={78}
                height={78}
              />
            <p className="text-lg">Integrates with your existing broker accounts, so getting started is seamless.</p>
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
      <div className="grid grid-cols-2 grid-rows-[0.50fr_1fr_0.50fr] sm:grid-rows-3 place-items-center bg-white px-6 sm:px-12 lg:px-36 py-24 sm:py-36">
        <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
            <LuLink size={32} className="mr-2" />
            <h3 className="text-2xl">Link Your Existing Broker</h3>
        </div>
        <Image
          src="/landing-page/iphone-transparent-with-brokers.png"
          alt="iPhone"
          width={360}
          height={360}
          className="sm:row-span-3"
        />
        <div className="max-w-[540px] flex flex-col items-start gap-4">
          <p className="text-lg">We are not a broker! We integrate with your existing accounts, so it&apos;s easy to get started.</p>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Button className="min-w-[160px] mt-4">
              <a href="" className="no-underline">View Available Brokers</a>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white px-6 sm:px-12 lg:px-36 py-24 sm:py-36">
        <div className="max-w-[540px] flex flex-col text-center gap-4 mb-24">
          <h2 className="text-4xl font-bold mb-12">Where We Sit</h2>
          <p className="text-lg">We aim to provide the same personalised investment experience as a full-service adviser at the cost of a discount broker.</p>
        </div>
        <Image 
          src="/landing-page/where-we-sit.png"
          alt="iPhone"
          width={800}
          height={465}
        />
      </div>
      <div className="bg-white px-6 sm:px-12 lg:px-36 py-24 sm:py-36">
        <div className="grid grid-cols-2 place-items-center gap-y-12">
          <div className="max-w-[540px] flex flex-col items-center gap-6 col-span-2 sm:col-span-1">
            <div className="flex flex-col gap-4 mb-6">
              <h2 className="text-3xl font-medium">Try us out for free.</h2>
              <p className="text-lg">Let us help you begin your investing journey.</p>
            </div>
            <div className="flex gap-6">
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
                <DemoLoginButton />
              </>
              )}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <Image 
              src=""
              alt="Compound returns on investment"
              width={100}
              height={100}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
