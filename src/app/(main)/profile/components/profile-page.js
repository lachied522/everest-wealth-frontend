"use client";
import { useState, useEffect } from "react";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { LuPencil, LuSave, LuMapPin, LuCalendar } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/components/lib/utils";

import IndustryPreferences from "./industry-preferences";


export default function ProfilePage({ profileData, userName }) {
  const supabase = createClientComponentClient();
  const [data, setData] = useState(profileData); // object to keep track of user changes
  const [edit, setEdit] = useState(false); // defines whether user is in edit mode

  const commitProfile = async () => {
    const profileCopy = {...data}; // create copy of profile
    delete profileCopy['id']; // delete id from profile
    const { data, error } = await supabase
    .from('profiles')
    .insert({
        ...profileCopy,
        'user_id': session.user.id
    })
    .select();

    if (error) console.log(error);
  }

  const handleSave = async () => {
    if (data !== profileData) {
      await updateProfile(data);
    }
    setEdit(false);
  }

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleChange = ({ name, value }) => {
    
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const onDataChange = (e) => {
    console.log(e);
    //handleChange(e.target);
  }

  return (
    <div className="md:max-w-screen-lg px-6 mx-auto">
      <div className='flex flex-col justify-end min-h-[274px] rounded relative overflow-hidden p-6 mb-6'>
        <img
          src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg"
          loading="eager"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 96vw, (max-width: 1439px) 79vw, 1044px"
          srcSet="
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-500.jpeg   500w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-800.jpeg   800w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1080.jpeg 1080w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1600.jpeg 1600w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-2000.jpeg 2000w,
                https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg         2088w
              "
          alt='Cover Image'
          className='z-[-1] h-full object-cover absolute inset-0'
        />
        <div className='z-[-1] opacity-60 bg-[linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0.84))] absolute top-[24%] bottom-0 inset-x-0' />
        <div className='flex justify-between items-end'>
          <h3 className="text-slate-800 mb-2">
            {userName}
          </h3>
        </div>
      </div>
      <div>
          <div className='grid grid-cols-4 items-center justify-items-center'>
            <h4 className='mb-0'>About Me</h4>
            <div className="flex items-center gap-2">
              <LuMapPin size={16} className='text-blue-800'/>
              <div className="text-slate-800">Los Angeles, CA</div>
            </div>
            <div className="flex align-center gap-2">
              <LuCalendar size={16} className="text-blue-800"/>
              <div className="text-slate-800">Jan 2, 2021</div>
            </div>
            {edit ? (
            <Button onClick={handleSave}>
              <LuSave
                className="mr-2"
              />
              Save
            </Button>
            ) : (
            <Button onClick={handleEditClick}>
              <LuPencil 
                className="mr-2"
              />
              Edit Profile
            </Button>
            )}
          </div>
      </div>
      <form>
        <div className='flex flex-col gap-12 px-6 relative'>
            <div className={cn(
              'absolute inset-0 bg-slate-50/40',
              edit && 'hidden'
            )}/>
          <Separator className="my-4"/>
          <div>
              <h4 className="mb-6">Finances</h4>
              <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16">
                <div className="w-full text-left text-lg text-slate-800">Employment type</div>
                <Select
                  name="employment"
                  value={data?.employment || ""}
                  onChange={onDataChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-full text-left text-lg text-slate-800">
                  What proportion of your monthly income do you usually invest?
                </div>
                <Select
                  name="salary"
                  value={data?.salary || ""}
                  onChange={onDataChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="1">1% - 5%</SelectItem>
                    <SelectItem value="2">5% - 10%</SelectItem>
                    <SelectItem value="3">10% - 25%</SelectItem>
                    <SelectItem value="4">25% - 50%</SelectItem>
                    <SelectItem value="5">50% +</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-full text-left text-lg text-slate-800">
                  What proportion of your net worth does your portfolio make up?
                </div>
                <Select
                  name="assets"
                  value={data?.assets || ""}
                  onChange={onDataChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0% - 10%</SelectItem>
                    <SelectItem value="1">10% - 25%</SelectItem>
                    <SelectItem value="2">25% - 50%</SelectItem>
                    <SelectItem value="3">50% - 75%</SelectItem>
                    <SelectItem value="4">75% +</SelectItem>
                  </SelectContent>
                </Select>
                <div className="w-full text-left text-lg text-slate-800">
                  Are you borrowing to invest in shares?
                </div>
                <RadioGroup className="flex items-center justify-center gap-4">
                    <RadioGroupItem
                      type="radio"
                      name="borrowing"
                      value={true}
                      data-name="borrowing"
                      checked={data? data.borrowing: false}
                      onChange={onDataChange}
                    />
                    <Label htmlFor={true}>Yes</Label>
                    <RadioGroupItem
                      type="radio"
                      name="borrowing"
                      value={false}
                      data-name="borrowing"
                      checked={data? !data.borrowing: true}
                      onChange={onDataChange}
                    />
                    <Label htmlFor={false}>No</Label>
                </RadioGroup>
              </Card>
          </div>
          <Separator className="my-4"/>
          <div>
              <h4 className="mb-6">Experience</h4>
              <Card className="grid grid-cols-2 items-center justify-items-center gap-12 p-16">
                <div className="text-lg text-slate-800">
                  How many years&#x27; experience do you have investing in stocks?
                </div>
                <Select
                  name="experience"
                  value={data?.experience || ""}
                  onValueChange={onDataChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select one..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5 +</SelectItem>
                  </SelectContent>
                </Select>
              </Card>
          </div>
          <Separator className="my-4"/>
          <div>
              <h4 className="mb-6">Risk Tolerance</h4>
              <Card className="flex flex-col justify-center gap-16 p-16">
                <div className="flex flex-col gap-6 items-center">
                  <div className="text-lg text-slate-800">
                    Which of the following best describes your association with
                    financial risk?
                  </div>
                  <div className="flex">
                    <label className="radio-button-field-wrapper w-radio">
                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                        <input 
                          type="radio" 
                          name="risk_tolerance_q1" 
                          value="1" 
                          checked={data? data.risk_tolerance_q1===1: false} 
                          onChange={onDataChange} 
                        />
                        <span className="text-300 w-form-label">Danger</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                        <input 
                          type="radio" 
                          name="risk_tolerance_q1" 
                          value="2" 
                          checked={data? data.risk_tolerance_q1===2: false} 
                          onChange={onDataChange} 
                        />
                        <span className="text-300 w-form-label">Uncertainty</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                        <input 
                          type="radio" 
                          name="risk_tolerance_q1" 
                          value="3" 
                          checked={data? data.risk_tolerance_q1===3: true} 
                          onChange={onDataChange} 
                        />
                        <span className="text-300 w-form-label">Indifference</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                        <input 
                          type="radio" 
                          name="risk_tolerance_q1" 
                          value="4" 
                          checked={data? data.risk_tolerance_q1===4: false} 
                          onChange={onDataChange} 
                        />
                        <span className="text-300 w-form-label">Opportunity</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                        <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                        <input 
                          type="radio" 
                          name="risk_tolerance_q1" 
                          value="5" 
                          checked={data? data.risk_tolerance_q1===5: false} 
                          onChange={onDataChange}
                        />
                        <span className="text-300 w-form-label">Thrill</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="text-lg text-slate-800">
                    What is your willingness to take on financial risk?
                  </div>
                  <div className="flex">
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q2"
                        value="1"
                        data-name="risk_tolerance_q2"
                        checked={data? data.risk_tolerance_q2===1: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">Very low</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q2"
                        value="2"
                        data-name="risk_tolerance_q2"
                        checked={data? data.risk_tolerance_q2===2: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">Low</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q2"
                        value="3"
                        data-name="risk_tolerance_q2"
                        checked={data? data.risk_tolerance_q2===3: true}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">Average</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q2"
                        value="4"
                        data-name="risk_tolerance_q2"
                        checked={data? data.risk_tolerance_q2===4: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">High</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q2"
                        value="5"
                        data-name="risk_tolerance_q2"
                        checked={data? data.risk_tolerance_q2===5: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">Very high</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="text-lg text-slate-800">
                    What range of returns do you expect to receive from your
                    portfolio?
                  </div>
                  <div className="flex">
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q3"
                        value="1"
                        data-name="risk_tolerance_q3"
                        checked={data? data.risk_tolerance_q3===1: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">4% to 5%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q3"
                        value="2"
                        data-name="risk_tolerance_q3"
                        checked={data? data.risk_tolerance_q3===2: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">2% to 6%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q3"
                        value="3"
                        data-name="risk_tolerance_q3"
                        checked={data? data.risk_tolerance_q3===3: true}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">0% to 7%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q3"
                        value="4"
                        data-name="risk_tolerance_q3"
                        checked={data? data.risk_tolerance_q3===4: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">-2% to 10%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q3"
                        value="5"
                        data-name="risk_tolerance_q3"
                        checked={data? data.risk_tolerance_q3===5: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">-5% to 20%</span>
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-4 items-center">
                  <div className="text-lg text-slate-800">
                    How much could the <strong>total value</strong> of all your
                    portfolio fall before you begin to feel uncomfortable?
                  </div>
                  <div className="flex">
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q4"
                        value="1"
                        data-name="risk_tolerance_q4"
                        checked={data?.risk_tolerance_q4===1}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">&lt;10%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q4"
                        value="2"
                        data-name="risk_tolerance_q4"
                        checked={data? data.risk_tolerance_q4===2: false}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">10%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q4"
                        value="3"
                        data-name="risk_tolerance_q4"
                        checked={data?.risk_tolerance_q4===3}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">20%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q4"
                        value="4"
                        data-name="risk_tolerance_q4"
                        checked={data?.risk_tolerance_q4===4}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-label">30%</span>
                    </label>
                    <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input
                        type="radio"
                        name="risk_tolerance_q4"
                        value="5"
                        data-name="risk_tolerance_q4"
                        checked={data?.risk_tolerance_q4===5}
                        onChange={onDataChange}
                      />
                      <span className="text-300 w-form-">&gt;50%</span>
                    </label>
                  </div>
                </div>
              </Card>
          </div>
          <Separator className="my-4"/>
          <div>
              <h4 className="mb-6">Preferences</h4>
              <Card className="flex flex-col gap-12 items-center p-16">
                <div className="flex flex-col gap-12 items-center">
                  <div className="text-lg text-slate-800">
                    What proportion of your portfolio do you wish to invest in
                    international stocks?
                  </div>
                  <div className="flex gap-4 justify-stretch">
                    <span>0</span>
                    <Slider name="international" handleChange={handleChange}  disabled={!edit} className="w-[240px] cursor-pointer"/>
                    <span>100</span>
                  </div>
                  <div className="text-lg text-slate-800">
                    What proportion of your portfolio do you wish to invest in ETFs?
                  </div>
                  <div className="flex gap-4 justify-stretch">
                    <span>0</span>
                    <Slider name="passive" handleChange={handleChange} disabled={!edit} className="w-[240px] cursor-pointer"/>
                    <span>100</span>
                  </div>
                </div>
                <div className="text-lg text-slate-800">
                    Do you have any industry preferences?
                </div>
                <IndustryPreferences handleChange={handleChange} value={data?.preferences} />
              </Card>
          </div>
        </div>
      </form>
      <div className="flex justify-end p-12">
        {edit ? (
        <Button onClick={handleSave}>
          <LuSave
            className="mr-2"
          />
          Save
        </Button>
        ) : (
        <Button onClick={handleEditClick}>
          <LuPencil 
            className="mr-2"
          />
          Edit Profile
        </Button>
        )}
      </div>
    </div>
  );
}
