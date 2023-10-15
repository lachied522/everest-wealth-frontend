"use client";
import styles from "./objective-selector.module.css";

function Objective({ name, iconSrc, text, timeHorizon, selected, handleChange }) {

    const handleClick = () => {
      handleChange(name);
    };

    return (
      <div
        className={styles["select-option"] + (selected ? styles["selected"] : styles["unselected"])}
        onClick={handleClick}
      >
        <div className={styles["select-option-inner"]}>
          <div className="flex align-center mg-bottom-12px">
            <img
              loading="lazy"
              src={iconSrc}
              alt=""
              className="icon medium mg-right-12px"
            />
            <div className="heading-h6-size text-center">{name}</div>
          </div>
          <div className="text-center">
            <div className="text-200 text-center color-neutral-700 mg-bottom-6px">
              {text}
            </div>
            <div className="text-100">Time Horizon {timeHorizon}</div>
          </div>
        </div>
      </div>
    );
}
  
export default function ObjectiveSelector({ handleChange, value }) {
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
        timeHorizon: "4-5 years",
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
  
    const selectObjective = (name) => {
      handleChange({
        name: "objective",
        value: name,
      });
    }
  
    return (
      <div
        className={styles["investment-objective-selector"]}
      >
        {objectives.map((obj, i) => (
          <Objective 
            key={i}
            selected={(value===obj.name)} 
            handleChange={selectObjective}
            {...obj}
          />
        ))}
      </div>
    );
  }