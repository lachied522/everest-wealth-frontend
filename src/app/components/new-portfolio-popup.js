"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { LuPlus } from "react-icons/lu";

import ObjectiveSelector from "@/components/objective-selector";

export const NewPortfolioModule = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        existing: false,
        value: 0,
        objective: "Long-term/Retirement Savings"
    });

    const handleChange = ({ name, value } ) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    const onDataChange = (e) => {
        handleChange(e.target);
    }

    const onSubmit = async () => {
        console.log(formData);

        return;

        const res = await fetch('/api/new-portfolio', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.ok) {
            router.push(res.url);
        }
    }

    return (
        <form className="flex flex-col items-center justify-center gap-16 md:px-3">
            <div className="text-lg text-slate-800">Portfolio Name</div>
            <Input
                type="text"
                maxLength={20}
                name="name"
                data-name="Name"
                placeholder="My Portfolio"
                value={formData.name || ""}
                onChange={onDataChange}
                className='max-w-[25%] min-w-[200px]'
            />
            <div className="text-lg text-slate-800">
                Is this an existing portfolio?
            </div>
            <div className="flex">
                <label className="radio-button-field-wrapper w-radio">
                    <input
                        type="radio"
                        name="existing"
                        value={true}
                        data-name="existing"
                        className="w-form-formradioinput radio-button w-radio-input"
                        checked={Boolean(formData.existing || false)}
                        onChange={onDataChange}
                    />
                    <span className="w-form-label">
                    Yes
                    </span>
                </label>
                <label className="radio-button-field-wrapper w-radio">
                    <input
                        type="radio"
                        name="existing"
                        value={false}
                        data-name="existing"
                        className="w-form-formradioinput radio-button w-radio-input"
                        checked={Boolean(!formData.existing || true)}
                        onChange={onDataChange}
                    />
                    <span className="w-form-label">
                        No
                    </span>
                </label>
            </div>
        
            {true && (
            <>
                <div className="text-lg text-slate-800">
                    What is the intended value of this portfolio?
                    </div>
                    <Input
                        type="number"
                        min={0}
                        maxLength="256"
                        name="value"
                        data-name="value"
                        placeholder="$10,000"
                        onChange={onDataChange}
                        className='max-w-[25%] min-w-[200px]'
                    />
                <div className="text-lg text-slate-800">
                    What is the objective for this portfolio?
                </div>
                <ObjectiveSelector handleChange={handleChange} value={formData.objective || ""} />
            </>
            )}
            <div className="flex gap-6 justify-stretch">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {}}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => {}}
                    type="button"
                >
                    Submit
                </Button>
            </div>
        </form>
    )
}

export const NewPortfolioPopup = () => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <LuPlus
                        className="mr-2"
                    />
                    New Portfolio
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Portfolio</DialogTitle>
                </DialogHeader>
                <NewPortfolioModule ref={formRef} />
                <div className="grid gap-6 grid-cols-2 items-center">
                    <DialogClose asChild>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => {}}
                        >
                        Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            onClick={() => {}}
                            type="button"
                        >
                        Done
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );

}
