"use client";
import styles from "./range-slider.module.css";

export default function RangeSlider({ name, intialValue, min=0, max=100 }) {
    return (
      <div className="range-input-wrapper">
      <div className="text-200 color-neutral-700">0</div>
      <input
        className={styles.slider}
        name={name}
        type="range"
        min={min}
        max={max}
        defaultValue={intialValue}
      />
      <div className="text-200 color-neutral-700">100</div>
    </div>
    )
  }