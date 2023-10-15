"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/GlobalState";
import ObjectiveSelector from "@/components/objective-selector";
import RangeSlider from "./range-slider";
import IndustryPreferences from "./industry-preferences";
import styles from "./profile-page.module.css";

export default function ProfilePage() {
  const { profileData, updateProfile } = useGlobalContext();
  const [data, setData] = useState(profileData || {}); //object to keep track of user changes
  const [edit, setEdit] = useState(false); //defines whether user is in edit mode

  useEffect(() => {
    setData(profileData || {});
  }, [profileData]);

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSave = async () => {
    if (data !== profileData) {
      await updateProfile(data);
    }
    setEdit(false);
  }

  const handleChange = ({ name, value }) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const onDataChange = (e) => {
    handleChange(e.target);
  }

  return (
    <>
      <div className="container-default w-container">
        <div className={styles["profile-top-container"]}>
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
            alt=""
            className={styles["profile-bg-banner-image"]}
          />
          <div className={styles["profile-bg-banner-gradient"]} />
          <div className={styles["profile-name-container"]}>
            <div className="flex align-center">
              <div>
                <div className="heading-h3-size color-neutral-100 mg-bottom-8px">
                  John Carter
                </div>
                <div className="heading-h5-size color-neutral-100 opacity-80">
                  CEO at Dashly X
                </div>
              </div>
            </div>
            {edit ? (
              <button className="btn-secondary small" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="btn-secondary small" onClick={handleEditClick}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <form>
        <div className={styles["user-profile"]}>
          <div
            className={styles["user-profile-overlay"] + (edit ? styles["hidden"] : "")}
          ></div>
          <div>
            <div className="grid-4-columns align-center">
              <h4 className="display-4 mg-bottom-0">About Me</h4>
              <div className="flex align-center">
                <div className="custom-icon color-accent-1 mg-right-8px"></div>
                <div className="text-300 color-neutral-800">john@dashly.com</div>
              </div>
              <div className="flex align-center">
                <div className="custom-icon color-accent-1 mg-right-8px"></div>
                <div className="text-300 color-neutral-800">Los Angeles, CA</div>
              </div>
              <div className="flex align-center">
                <div className="custom-icon color-accent-1 mg-right-8px"></div>
                <div className="text-300 color-neutral-800">Jan 2, 2021</div>
              </div>
            </div>
          </div>
          <div className="divider _18px" />
          <div>
            <div className="mg-bottom-24px">
              <h4 className="display-4 mg-bottom-24px">Investment Objective</h4>
              <div className="text-400 color-neutral-800">
                What is your primary investment objective?
              </div>
            </div>
            <ObjectiveSelector handleChange={handleChange} value={data?.objective} />
          </div>
          <div className="divider _18px"></div>
          <div className="w-form">
              <div className="display-4 mg-bottom-24px">Finances</div>
              <div className="grid-2-columns _1-2fr---1fr gap-48px">
                <div className="text-400 color-neutral-800">Employment type</div>
                <select
                  className="input select small w-select"
                  name="employment"
                  value={data?.employment || ""}
                  onChange={onDataChange}
                >
                  <option value="">Select one...</option>
                  <option value="student">Student</option>
                  <option value="casual">Casual</option>
                  <option value="part-time">Part Time</option>
                  <option value="full-time">Full Time</option>
                  <option value="freelance">Freelance</option>
                  <option value="retired">Retired</option>
                </select>
                <div className="text-400 color-neutral-800">
                  What proportion of your monthly income do you usually invest?
                </div>
                <select
                  className="input select small w-select"
                  name="salary"
                  value={data?.salary || ""}
                  onChange={onDataChange}
                >
                  <option value="">Select one...</option>
                  <option value="0">0%</option>
                  <option value="1">1% - 5%</option>
                  <option value="2">5% - 10%</option>
                  <option value="3">10% - 25%</option>
                  <option value="4">25% - 50%</option>
                  <option value="5">50% +</option>
                </select>
                <div className="text-400 color-neutral-800">
                  What proportion of your net worth does your portfolio make up?
                </div>
                <select
                  className="input select small w-select"
                  name="assets"
                  value={data?.assets || ""}
                  onChange={onDataChange}
                >
                  <option value="">Select one...</option>
                  <option value="0">0% - 10%</option>
                  <option value="1">10% - 25%</option>
                  <option value="2">25% - 50%</option>
                  <option value="3">50% - 75%</option>
                  <option value="4">75% +</option>
                </select>
                <div className="text-400 color-neutral-800">
                  Are you borrowing to invest in shares?
                </div>
                <div className="flex align-center justify-center gap-column-12px">
                  <label className="radio-button-field-wrapper w-radio">
                    <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                    <input
                      type="radio"
                      name="borrowing"
                      value={true}
                      data-name="borrowing"
                      checked={data? data.borrowing: false}
                      onChange={onDataChange}
                    />
                    <span className="text-300 w-form-label">Yes</span>
                  </label>
                  <label className="radio-button-field-wrapper w-radio">
                    <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                    <input
                      type="radio"
                      name="borrowing"
                      value={false}
                      data-name="borrowing"
                      checked={data? !data.borrowing: true}
                      onChange={onDataChange}
                    />
                    <span className="text-300 w-form-label">No</span>
                  </label>
                </div>
              </div>
          </div>
          <div className="divider _18px"></div>
          <div className="w-form">
              <div className="display-4 mg-bottom-24px">Experience</div>
              <div className="grid-2-columns _1-2fr---1fr gap-row-48px">
                <div className="text-400 color-neutral-800">
                  How many years&#x27; experience do you have investing in stocks?
                </div>
                <select
                  className="input select small w-select"
                  name="experience"
                  value={data?.experience || ""}
                  onChange={onDataChange}
                >
                  <option value="">Select one...</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 +</option>
                </select>
              </div>
          </div>
          <div className="divider _18px"></div>
          <div className="w-form">
              <div className="display-4 mg-bottom-24px">Risk Tolerance</div>
              <div className="grid-1-column justify-center gap-row-80px">
                <div className="flex vertical gap-row-24px">
                  <div className="text-400 color-neutral-800">
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
                <div className="flex vertical gap-row-24px">
                  <div className="text-400 color-neutral-800">
                    What is your willingness to take on financial risk?
                  </div>
                  <div
                    className="flex"
                  >
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
                <div className="flex vertical gap-row-24px">
                  <div className="text-400 color-neutral-800">
                    What range of returns do you expect to receive from your
                    portfolio?
                  </div>
                  <div
                    id="w-node-_0a887c7b-caea-b82d-49a3-7e6aeef64787-2fdc4015"
                    className="flex"
                  >
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
                <div className="flex vertical gap-row-24px">
                  <div className="text-400 color-neutral-800">
                    How much could the <strong>total value</strong> of all your
                    portfolio fall before you begin to feel uncomfortable?
                  </div>
                  <div
                    id="w-node-_0a887c7b-caea-b82d-49a3-7e6aeef647a2-2fdc4015"
                    className="flex"
                  >
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
              </div>
          </div>
          <div className="divider _18px"></div>
          <div className="w-form">
              <div className="display-4 mg-bottom-24px">Preferences</div>
              <div className="flex vertical gap-48px">
                <div className="grid-1-column justify-center gap-48px">
                  <div className="text-400 color-neutral-800">
                    What proportion of your portfolio do you wish to invest in
                    international stocks?
                  </div>
                  <RangeSlider name="international" handleChange={handleChange} value={data?.international || 50} />
                  <div className="text-400 color-neutral-800">
                    What proportion of your portfolio do you wish to invest in ETFs?
                  </div>
                  <RangeSlider name="passive" handleChange={handleChange} value={data?.passive || 50} />
                </div>
                <div className="text-400 color-neutral-800">
                    Do you have any preferences?
                </div>
                <IndustryPreferences handleChange={handleChange} value={data?.preferences} />
              </div>
          </div>
        </div>
      </form>
    </>
  );
}
