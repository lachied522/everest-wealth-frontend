'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function () {
  const router = useRouter();
  const supabase = createClientComponentClient();

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.target);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.get("email"),
            password: formData.get("password")
        });
        
        if (error) throw new Error(error);

        router.refresh(); //middleware will redirect user
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <div
      data-w-id="42cec775-e6ca-8762-cd34-1c5d55bb5ed0"
      className="page-wrapper"
    >
      <div
        data-w-id="27d30c7f-b701-adb6-622d-3e7968cd8f44"
        className="top-bar-simple"
      >
        <div className="container-default w-container">
          <div className="flex-horizontal">
            <a href="/" className="top-bar-simple-logo w-inline-block">
              <img
                src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4107_dashly-webflow-template-logo.svg"
                loading="eager"
                alt="Dashly X Webflow Template - Logo"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="dashboard-main-content utility-page">
        <div className="container-default w-container">
          <div
            data-w-id="42cec775-e6ca-8762-cd34-1c5d55bb5ed4"
            className="module utility-page-form"
          >
            <div className="inner-container _444px text-center">
              <div className="inner-container _80px-mbl center">
                <img
                  src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40c5_log-in-icon-dashboardly-webflow-template.svg"
                  loading="eager"
                  alt=""
                  className="mg-bottom-20px"
                />
              </div>
              <div className="heading-h3-size mg-bottom-8px">Welcome back</div>
              <p className="mg-bottom-24px">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sedol do
                eiusmod tempor consectur.
              </p>
              <div className="form min-h-188px mg-bottom-24px w-form">
                <form
                  id="login-form"
                  name="login-form"
                  data-name="login-form"
                  method="get"
                  data-wf-page-id="64afbac916bb17eb2fdc3fb6"
                  data-wf-element-id="42cec775-e6ca-8762-cd34-1c5d55bb5edd"
                  onSubmit={handleLogin}
                >
                  <input
                    type="email"
                    className="input mg-bottom-16px w-input"
                    maxLength={256}
                    name="email"
                    data-name="email"
                    placeholder="Email address"
                    id="email"
                    required=""
                  />
                  <input
                    type="password"
                    className="input mg-bottom-16px w-input"
                    maxLength={256}
                    name="password"
                    data-name="password"
                    placeholder="Password"
                    id="password"
                    required=""
                  />
                  <input
                    id="login-button"
                    type="submit"
                    value="Sign In"
                    data-wait="Please wait..."
                    className="btn-primary width-100 w-button"
                  />
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
              <div className="mg-bottom-24px">
                <div className="grid-2-columns _2-col-mbl gap-0">
                  <div
                    id="w-node-cba12da5-978a-4038-820c-6951096da839-2fdc3fb6"
                    className="flex align-center text-left"
                  >
                    <div className="mg-bottom-0 mg-right-8px w-form">
                      <form
                        id="email-form"
                        name="email-form"
                        data-name="Email Form"
                        method="get"
                        data-wf-page-id="64afbac916bb17eb2fdc3fb6"
                        data-wf-element-id="77b95bf4-3539-d1f4-01d4-a66d2f1842d1"
                      >
                        <label className="w-checkbox checkbox-field-wrapper small">
                          <div className="w-checkbox-input w-checkbox-input--inputType-custom checkbox w--redirected-checked"></div>
                          <input
                            type="checkbox"
                            id="checkbox-3"
                            name="checkbox-3"
                            data-name="Checkbox 3"
                          />
                          <span
                            className="hidden-on-desktop w-form-label"
                          >
                            Placeholder
                          </span>
                        </label>
                      </form>
                    </div>
                    <div className="text-200 medium color-neutral-700">
                      Remember account
                    </div>
                  </div>
                  <a
                    id="w-node-_1f903f57-7a6c-b2f2-38ba-e004e972201f-2fdc3fb6"
                    data-w-id="1f903f57-7a6c-b2f2-38ba-e004e972201f"
                    href="/utility-pages/reset-password"
                    className="text-decoration-none color-transition-none text-right w-inline-block"
                  >
                    <div
                      id="w-node-_4debbe78-d89c-ac7d-acb5-b37b4d21542f-2fdc3fb6"
                      className="text-200 medium color-neutral-800"
                    >
                      Forgot your password?
                    </div>
                  </a>
                </div>
              </div>
              <div className="grid-1-column gap-row-12px mg-bottom-24px">
                <a
                  href="https://www.google.com/"
                  target="_blank"
                  className="btn-secondary sign-in-button w-inline-block"
                >
                  <div className="flex-horizontal">
                    <img
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
                    <img
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
            </div>
          </div>
        </div>
      </div>
      <div
        data-w-id="297d8ad8-db4a-3ae2-197c-704798a15c49"
        className="dashboard-footer-wrapper"
      >
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
  );
}
