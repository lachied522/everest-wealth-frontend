'use client';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import Link from "next/link";
import Image from "next/image";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function SignupPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const { data, error } = await supabase.auth.signUp(
          {
            email: formData.get("email"),
            password: formData.get("password"),
            options: {
              data: {
                name: formData.get("name"),
              }
            }
          }
        );
        
        if (error) throw new Error(error);
        
        console.log(data);
        router.refresh(); //middleware will redirect user
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <div className="h-[100vh] grid grid-cols-2 ">
        <div>
          <div className="flex items-center justify-center py-8">
                <Link
                  href="/"
                  className="max-w-[160px] transform transition duration-300 relative hover:scale-110"
                >
                  <Image
                    src="/palladian.svg"
                    alt="Palladian Logo"
                    width={48}
                    height={48}
                  />
                </Link>
          </div>
          <div className="flex flex-col justify-center justify-items-center items-center">
            <Card className='max-w-lg p-16'>
                <div className="flex justify-center mb-4">
                  <Image
                    src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c5_log-in-icon-dashboardly-webflow-template.svg"
                    loading="eager"
                    alt=""
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="mb-2">Create an Account</h3>
                <p className="mb-6">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sedol do
                  eiusmod tempor consectur.
                </p>
                <div className="min-h-[144px] mb-6">
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                      type="text"
                      maxLength={256}
                      name="name"
                      data-name="name"
                      placeholder="Name"
                      required
                    />
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
                  <div className="success-message utility-page-success-message w-form-done">
                    <div>Welcome!</div>
                  </div>
                  <div className="error-message w-form-fail">
                    <div>
                      Oops! Something went wrong while submitting the form.
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="grid grid-cols-2 sm:grid-cols-1">
                    <div className="flex align-center text-left">
                      <div className="mg-bottom-0 mg-right-8px w-form">
                        <form
                          name="email-form"
                          data-name="Email Form"
                          data-wf-page-id="64afbac916bb17eb2fdc3fb6"
                          data-wf-element-id="77b95bf4-3539-d1f4-01d4-a66d2f1842d1"
                        >
                          <label className="w-checkbox checkbox-field-wrapper small">
                            <div className="w-checkbox-input w-checkbox-input--inputType-custom checkbox w--redirected-checked"></div>
                            <input
                              type="checkbox"
                              name="remember"
                              data-name="remember"
                            />
                          </label>
                        </form>
                      </div>
                      <div className="text-sm font-medium text-slate-700">
                        Accept Terms and Conditions
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  <a
                    href="https://www.google.com/"
                    target="_blank"
                    className="btn-secondary sign-in-button w-inline-block"
                  >
                    <div className="flex-horizontal">
                      <Image
                        src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c8_google-button-icon-dashboardly-webflow-template.svg"
                        loading="eager"
                        alt="Google - Dashly X Webflow Template"
                        className="mg-right-8px"
                      />
                      <div className="text-200 medium">Sign in with Google</div>
                    </div>
                  </a>
                  <a
                    href="https://www.google.com/"
                    target="_blank"
                    className="btn-secondary sign-in-button w-inline-block"
                  >
                    <div className="flex-horizontal">
                      <Image
                        src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c9_facebook-button-icon-dashboardly-webflow-template.svg"
                        loading="eager"
                        alt="Facebook - Dashly X Webflow Template"
                        className="mg-right-8px"
                      />
                      <div className="text-200 medium">Sign in with Facebook</div>
                    </div>
                  </a>
                </div>
                <div className="flex-horizontal flex-wrap">
                  <div className="text-200 medium color-neutral-800">
                    Don’t have an account? 
                  </div>
                  <a href="/utility-pages/sign-up" className="text-200">
                    Create an account
                  </a>
                </div>
            </Card>
          </div>
        </div>
        <div />
        <div className='col-span-2'>
          <div className="dashboard-footer-wrapper">
            <div className="container-default w-container">
              <div className="dashboard-footer-inner-wrapper">
                <div>
                  Copyright © Dashly X | Designed by
                  <a href="https://brixtemplates.com/">BRIX Templates</a> - Powered
                  by <a href="https://webflow.com/">Webflow</a>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
