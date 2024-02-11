'use client';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import Footer from 'src/app/footer';

import type { Database } from '@/types/supabase';

export default function Page() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData(e.currentTarget);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: String(formData.get("email")),
            password: String(formData.get("password"))
        });
        
        if (error) throw new Error(`Error signing in: ${error}`);

        router.refresh(); //middleware will redirect user
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <div className="h-[100vh] grid grid-cols-1 content-between justify-stretch">
      <div className="h-full flex flex-col justify-center justify-items-center items-center">
        <div className="flex items-center justify-center py-8">
            <Link
              href="/"
              className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
            >
              <Image
                  src="/everest-logo-transparent-background.png"
                  alt="Everest Logo"
                  width={48}
                  height={48}
              />
            </Link>
        </div>
        <Card className='w-[440px] p-16'>
            <div className="flex items-center justify-center gap-6 mb-12">
              <Image
                src="/login-icon.svg"
                loading="eager"
                alt=""
                width={56}
                height={56}
              />
              <h3 className="text-2xl font-semibold">Welcome back</h3>
            </div>
            <div className="min-h-[144px] mb-6">
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <Input
                  type="email"
                  maxLength={256}
                  name="email"
                  data-name="email"
                  placeholder="Email address"
                  required
                />
                <Input
                  type="password"
                  maxLength={256}
                  name="password"
                  data-name="password"
                  placeholder="Password"
                  id="password"
                  required
                />
                <Button
                  type="submit"
                  value="Sign In"
                  data-wait="Please wait..."
                >
                  Sign In
                </Button>
              </form>
            </div>
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-1">
                <Link
                  href=""
                  className="no-underline"
                >
                  <div
                    className="text-sm font-medium text-slate-800"
                  >
                    Forgot your password?
                  </div>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 mb-6">
              <Button variant='secondary'>
                <Image
                  src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c8_google-button-icon-dashboardly-webflow-template.svg"
                  loading="eager"
                  alt="Google"
                  className="h-4 mr-2"
                  width={16}
                  height={16}
                />
                <div className="text-sm font-medium">Sign in with Google</div>
              </Button>
              <Button variant='secondary'>
                  <Image
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c9_facebook-button-icon-dashboardly-webflow-template.svg"
                    loading="eager"
                    alt="Facebook - Dashly X Webflow Template"
                    className="h-4 mr-2"
                    width={16}
                    height={16}
                  />
                  <div className="text-sm font-medium">Sign in with Facebook</div>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-1">
              <div className="text-sm font-medium text-slate-800">
                Don&apos;t have an account?
              </div>
              <a href="/signup" className="text-blue-600 text-sm font-medium underline">
                Create an account
              </a>
            </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
