"use client";
import { useState } from "react";

export default function SelectWrapper({ name, handleProfileChange, children, initialState="" }) {
    const [selected, setSelected] = useState(initialState);
  
    const handleChange = (event) => {
      let e = event.target;
      const newValue = event.target.value;
      setSelected(newValue);
      handleProfileChange({
        name: name,
        value: newValue
      });
    }
  
    return (
      <select 
        name={name}
        onChange={handleChange}
        className="input select small w-select"
      >
        {children}
      </select>
    )
  }