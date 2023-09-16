"use client";
import { useState, Children } from "react";

export default function RadioButtonGroup({ name, handleProfileChange, children, initialState="" }) {
    const [selected, setSelected] = useState(initialState);

    const handleChange = (e) => {
        console.log(e);
    }

    return (
        <div className="flex">
            {children}
        </div>
    )
}