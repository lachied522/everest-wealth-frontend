"use client";
import { useState, useCallback } from "react";

import { LuMessageCircle, LuBell, LuBellMinus } from "react-icons/lu";

import { useAICompanionContext, AICompanionState } from "@/components/ai-companion/AICompanionState";

import { cn } from "@/components/lib/utils";

import AICompanionPopup from "@/components/ai-companion/ai-companion-popup";

export default function AICompanionTrigger() {
    const { toast } = useAICompanionContext() as AICompanionState;
    const [isSilent, setIsSilent] = useState<boolean>(false);

    const toggleIsSilent = useCallback(() => {
        setIsSilent((prevState) => !prevState);
    }, [setIsSilent]);

    return (
        <div className="bg-slate-50 shadow-lg rounded-full fixed bottom-16 right-24 p-4 cursor-pointer hover:rounded-2xl group">
            <div className="hidden rounded-full bg-white/90 p-1 -top-0.5 -right-0.5 absolute hover:scale-110 group-hover:block" onClick={toggleIsSilent} >
                {isSilent ? <LuBell size={16} className="text-slate-700" /> : <LuBellMinus size={16} className="text-slate-700" />}
            </div>
            <AICompanionPopup>
                <div className={cn(
                    toast && "flex items-center gap-2"
                )}>
                    <div className={cn(
                        "text-lg text-slate-800 font-medium -translate-x-full transition-transform duration-300 ease-in-out",
                        toast && "translate-x-0"
                    )}>{toast}</div>
                    <LuMessageCircle size={36} className="text-slate-800"/>
                </div>
            </AICompanionPopup>
        </div>
    )
}