"use client";
import { useState } from "react";

import styles from "./objective-selector.module.css";

function Objective(props) {

    const handleClick = () => {
      props.handleChange(props.index);
    };
  
    return (
      <div
        className={styles["select-option"] + (props.selected ? styles["selected"] : styles["unselected"])}
        onClick={handleClick}
      >
        <div className={styles["select-option-inner"]}>
          <div className="flex align-center mg-bottom-12px">
            <img
              loading="lazy"
              src={props.iconSrc}
              alt=""
              className="icon medium mg-right-12px"
            />
            <div className="heading-h6-size text-center">{props.name}</div>
          </div>
          <div className="text-center">
            <div className="text-200 text-center color-neutral-700 mg-bottom-6px">
              {props.text}
            </div>
            <div className="text-100">Time Horizon {props.timeHorizon}</div>
          </div>
        </div>
      </div>
    );
  }
  
export default function ObjectiveSelector({ handleProfileChange }) {
    const objectives = [
      {
        name: "Long-term/Retirement Savings",
        text: "Accumulate capital over the long term",
        timeHorizon: "20-30 years",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      },
      {
        name: "Passive Income",
        text: "Earn passive income from your investments to support your lifestyle",
        timeHorizon: "Indefinite",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      },
      {
        name: "Capital Preservation",
        text: "Invest your hard-earned capital in a safe environment",
        timeHorizon: "1-3 years",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      },
      {
        name: "First Home",
        text: "Save for a deposit on your first home",
        timeHorizon: "5-7 years",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      },
      {
        name: "Children",
        text: "Provide for your children in 10-20 years&#x27; time",
        timeHorizon: "10-20 years",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      },
      {
        name: "Trading",
        text: "Take advantage of opportunities to profit in the short-term",
        timeHorizon: "&lt;3 months",
        iconSrc:
          "https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc4180_icon-brix-template-Increase%20Graph.svg",
      }
    ];  
  
    const [selected, setSelected] = useState(null);
  
    const handleChange = (index) => {
      //set the selected index and update profile data
      setSelected(index);
      handleProfileChange({
        name: "objective",
        value: objectives[index].name
      });
    }
  
    return (
      <div
        className={styles["investment-objective-selector"]}
      >
        {objectives.map((obj, i) => (
          <Objective 
            key={i}
            index={i}
            selected={(selected===i)} 
            name={obj.name}
            text={obj.text}
            timeHorizon={obj.timeHorizon}
            iconSrc={obj.iconSrc}
            handleChange={handleChange}
          />
        ))}
      </div>
    );
  }