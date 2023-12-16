"use client"
import { useState, useMemo } from "react"

import { format, isValid, parse } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { LuCalendar } from "react-icons/lu"

import { cn } from "@/components/lib/utils"

interface DOBPickerProps {
    value: Date
    onChange: (v: any) => void
}

export default function DOBPicker({
    value,
    onChange
}: DOBPickerProps) {
    const [selected, setSelected] = useState<Date>(value)
    const [inputValue, setInputValue] = useState<string>('')

    const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value)

        const date = parse(e.currentTarget.value, 'dd/MM/y', new Date())
        if (isValid(date)) {
            onChange(date)
            setSelected(date)
        } else {
            onChange(undefined)
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button 
                    variant="ghost"
                    className={cn(
                        "flex justify-start pl-3 text-left font-normal",
                        !value && "text-muted-foreground"
                        )}
                >
                    <LuCalendar size={16} className="text-blue-800 mr-2"/>
                    {isValid(value) && (
                        format(value, "PPP")
                    )}
                    {!isValid(value) && (
                        <span>Select your DOB</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                <Input placeholder="DD/MM/YYYY" value={inputValue} onChange={onInputChange} />
                <div className="rounded-md border">
                    <Calendar
                        mode="single"
                        selected={selected}
                        defaultMonth={selected}
                        onSelect={onChange}
                        initialFocus={isValid(value)}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}


