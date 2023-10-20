"use client";
import { useState } from "react";

import { useGlobalContext } from "@/context/GlobalState";
import ObjectiveSelector from "./objective-selector";
import RangeSlider from "./range-slider";
import IndustryPreferences from "./industry-preferences";
import styles from "./user-profile.module.css";

export default function UserProfile({ edit, confirmChanges }) {
  const { profileData, updateProfile} = useGlobalContext();
  const [data, setData] = useState(profileData || {});

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
    <form
      onChange={onDataChange}
    >
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
          <ObjectiveSelector handleChange={handleChange}/>
        </div>
        <div className="divider _18px"></div>
        <div className="w-form">
            <div className="display-4 mg-bottom-24px">Finances</div>
            <div className="grid-2-columns _1-2fr---1fr gap-48px">
              <div className="text-400 color-neutral-800">Employment type</div>
              <select
                className="input select small w-select"
                name="employment"
                defaultValue={data?.employment || ""}
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
                What proportion of your income do you usually invest?
              </div>
              <select
                className="input select small w-select"
                name="salary"
                defaultValue={data?.salary || ""}
              >
                <option value="">Select one...</option>
                <option value="25000">$0 to $25,000</option>
                <option value="50000">$26,000 to $50,000</option>
                <option value="75000">$51,000 to $75,000</option>
                <option value="100000">$76,000 to $100,000</option>
                <option value="125000">$101,000 to $125,000</option>
                <option value="150000">$126,000 +</option>
              </select>
              <div className="text-400 color-neutral-800">
                What proportion of your net worth does your portfolio make up?
              </div>
              <select
                className="input select small w-select"
                name="assets"
                defaultValue={data?.assets || ""}
              >
                <option value="">Select one...</option>
                <option value="25000">$0 to $25,000</option>
                <option value="50000">$26,000 to $50,000</option>
                <option value="75000">$51,000 to $75,000</option>
                <option value="100000">$76,000 to $100,000</option>
                <option value="125000">$101,000 to $125,000</option>
                <option value="150000">$126,000 +</option>
              </select>
              <div className="text-400 color-neutral-800">
                Are you borrowing to invest in shares?
              </div>
              <div className="flex align-center justify-center gap-column-12px">
                <label className="radio-button-field-wrapper w-radio">
                  <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                  <input
                    type="radio"
                    name="finances-q4"
                    value="Yes"
                    data-name="finances-q4"
                  />
                  <span className="text-300 w-form-label">Yes</span>
                </label>
                <label className="radio-button-field-wrapper w-radio">
                  <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                  <input
                    type="radio"
                    name="finances-q4"
                    value="No"
                    data-name="finances-q4"
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
                name="employment"
                defaultValue={data?.employment || ""}
              >
                <option value="">Select one...</option>
                <option value="student">Student</option>
                <option value="casual">Casual</option>
                <option value="part-time">Part Time</option>
                <option value="full-time">Full Time</option>
                <option value="freelance">Freelance</option>
                <option value="retired">Retired</option>
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
                      <input type="radio" name="risk_tolerance_q1" value="1" />
                      <span className="text-300 w-form-label">Danger</span>
                  </label>
                  <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input type="radio" name="risk_tolerance_q1" value="2" />
                      <span className="text-300 w-form-label">Uncertainty</span>
                  </label>
                  <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input type="radio" name="risk_tolerance_q1" value="3" />
                      <span className="text-300 w-form-label">Indifference</span>
                  </label>
                  <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input type="radio" name="risk_tolerance_q1" value="4" />
                      <span className="text-300 w-form-label">Opportunity</span>
                  </label>
                  <label className="radio-button-field-wrapper w-radio">
                      <div className="w-form-formradioinput w-form-formradioinput--inputType-custom radio-button w-radio-input"></div>
                      <input type="radio" name="risk_tolerance_q1" value="5" />
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
                <RangeSlider name="international" intialValue={data?.international || 50} />
                <div className="text-400 color-neutral-800">
                  What proportion of your portfolio do you wish to invest in ETFs?
                </div>
                <RangeSlider name="passive" intialValue={data?.passive || 50} />
              </div>
              <div className="text-400 color-neutral-800">
                  Do you have any preferences?
              </div>
              <IndustryPreferences handleChange={handleChange}/>
            </div>
        </div>
      </div>
    </form>
  );
}
