"use client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton";
import { LuSettings, LuPencil } from "react-icons/lu";

import { useGlobalContext } from "@/context/GlobalState";

export default function PortfolioName({ portfolio }) {
    const { updatePortfolioName } = useGlobalContext(); //raw portfolio data
    const inputRef = useRef(null);

    const [name, setName] = useState(portfolio?.name);
    const [isEdit, setIsEdit] = useState(false);

    const onChange = (e) => {
        setName(e.target.value);
    }

    const handleKeyDown = async (e) => {
        if (isEdit) {
            if (e.key === 'Enter') {
                // user pressed Enter, save the changes
                setIsEdit(false);
                if (e.target.value !== portfolio.name && e.target.value.length < 20) {
                    await updatePortfolioName(
                        portfolio.id,
                        e.target.value
                    );
                }
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

    useEffect(() => {
        if (isEdit) {
          // focus the input element when isEdit becomes true
          inputRef.current.focus();
        }
      }, [isEdit]);

    return (
        <div className="flex items-center justify-items-stretch gap-4 sm:gap-2">
            <LuSettings
                className="text-lg text-slate-800 cursor-pointer hover:scale-110" 
                size={20}
                onClick={() => setIsEdit(!isEdit)}
            />
            <Input
                ref={inputRef}
                disabled={!isEdit}
                className="text-lg w-[200px] sm:w-[80px] border-0 bg-transparent text-slate-800 disabled:cursor-text disabled:opacity-100"
                value={name}
                maxLength={20}
                onChange={onChange} 
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}