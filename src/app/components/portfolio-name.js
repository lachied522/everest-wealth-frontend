"use client";
import { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";

import { useGlobalContext } from "@/context/GlobalState";


export default function PortfolioName({ portfolio }) {
    const { updatePortfolioName } = useGlobalContext(); //raw portfolio data

    const [name, setName] = useState(portfolio?.name || "");
    const [isEdit, setIsEdit] = useState(false);

    const onChange = (e) => {
        setName(e.target.value);
    }

    const handleKeyDown = async (e) => {
        if (isEdit) {
            if (e.key === 'Enter') {
                // user pressed Enter, save the changes
                setIsEdit(false);
                await updatePortfolioName(
                    portfolio.id,
                    e.target.value
                );
            } else if (e.key === 'Escape') {
                // cancel edit
                setIsEdit(false);
                setName(portfolio?.name); // reset the input to the original value
            }
        }
    }
    
    useEffect(() => {
        // update portfolio name on change
        setName(portfolio?.name);
    }, [portfolio]);

    return (
        <div className="flex align-center">
            <LuPencil 
                className="heading-h4-size color-neutral-700 mg-right-6px" 
                onClick={() => setIsEdit(!isEdit)}
            />
            <input disabled={!isEdit} className="heading-h4-size mg-bottom-0" value={name} onChange={onChange} onKeyDown={handleKeyDown}/>
        </div>
    )
}