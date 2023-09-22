"use client";
import { useState } from "react";

export default function SelectWrapper({ name, updateProfile, children, initialState="" }) {
    const [selected, setSelected] = useState(initialState);
  
    const handleChange = (event) => {
      let e = event.target;
      const newValue = event.target.value;
      setSelected(newValue);
      updateProfile({
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