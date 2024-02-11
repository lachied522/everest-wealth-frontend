"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import Footer from "src/app/footer";

import type { Database } from "@/types/supabase";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
        // sign user up
        const { error: signupError } = await supabase.auth.signUp(
          {
            email: String(formData.get("email")),
            password: String(formData.get("password")),
            options: {
              data: {
                name: formData.get("name"),
                DOB: formData.get("DOB"),
              }
            }
          }
        );
        
        if (signupError) throw new Error(`Error signing up: ${signupError}`);

        // log user in
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: String(formData.get("email")),
            password: String(formData.get("password"))
        });
        
        router.push('/new-user');
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <div className="h-[100vh] grid grid-cols-1 sm:grid-cols-2">
        <div>
          <div className="flex items-center justify-center py-8">
              <Link
                href="/"
                className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
              >
                <Image
                  src="/everest-logo-transparent-background.png"
                  alt="Pocket Adviser Logo"
                  width={48}
                  height={48}
                />
              </Link>
          </div>
          <div className="flex flex-col justify-center justify-items-center items-center">
            <Card className="w-[440px] p-16">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <Image
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c5_log-in-icon-dashboardly-webflow-template.svg"
                    loading="eager"
                    alt=""
                    width={56}
                    height={56}
                  />
                  <h3 className="text-2xl font-medium">Create an Account</h3>
                </div>
                <div className="min-h-[144px] mb-6">
                  <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="w-full max-w-sm flex flex-col gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        maxLength={256}
                        name="name"
                        data-name="name"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="w-full max-w-sm flex flex-col gap-2">
                      <Label htmlFor="DOB">DOB</Label>
                      <Input
                        id="DOB"
                        type="text"
                        maxLength={10}
                        name="DOB"
                        data-name="DOB"
                        placeholder="DD/MM/YYYY"
                        required
                      />
                    </div>
                    <div className="w-full max-w-sm flex flex-col gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        maxLength={256}
                        name="email"
                        data-name="email"
                        placeholder="Email address"
                        required
                      />
                    </div>
                    <div className="w-full max-w-sm flex flex-col gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        maxLength={256}
                        name="password"
                        data-name="password"
                        placeholder="Password"
                        required
                      />
                    </div>
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
                    <div className="flex items-center text-left">
                      <div className="mb-0 mr-2">
                        <Checkbox id="terms" />
                      </div>
                      <label htmlFor="terms" className="text-sm font-medium text-slate-700">
                        Accept Terms and Conditions
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <Button variant="secondary">
                    <Image
                      src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c8_google-button-icon-dashboardly-webflow-template.svg"
                      loading="eager"
                      alt="Google"
                      className="h-4 mr-2"
                      width={16}
                      height={16}
                    />
                    <div className="text-sm font-medium">Sign up with Google</div>
                  </Button>
                  <Button variant="secondary">
                    <Image
                      src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c9_facebook-button-icon-dashboardly-webflow-template.svg"
                      loading="eager"
                      alt="Facebook - Dashly X Webflow Template"
                      className="h-4 mr-2"
                      width={16}
                      height={16}
                    />
                    <div className="text-sm font-medium">Sign up with Facebook</div>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  <div className="text-sm font-medium text-slate-800">
                    Already have an account?
                  </div>
                  <Link href="/login" className="text-blue-600 text-sm font-medium underline">
                    Login
                  </Link>
                </div>
            </Card>
          </div>
        </div>
        <div />
        <Footer />
    </div>
  );
}
