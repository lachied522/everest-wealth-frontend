"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ObjectiveSelector from "@/components/objective-selector";

export const NewPortfolioForm = ({ session }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState({
        name: "",
        existing: false,
        value: 0,
        objective: "Long-term/Retirement Savings"
    });

    const handleChange = ({ name, value } ) => {
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const onDataChange = (e) => {
        handleChange(e.target);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);

        formData.set('objective', data.objective);

        fetch('api/new-portfolio', {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            router.push(data.url);
        })
        .catch(err => console.log(err));
    }

    return (
        <form className="gap-16 flex-col flex items-center justify-stretch md:px-3" onSubmit={onSubmit}>
            <div className="text-lg text-slate-800">Portfolio Name</div>
            <Input
                type="text"
                maxLength="256"
                name="name"
                data-name="Name"
                placeholder="My Portfolio"
                onChange={onDataChange}
                className='max-w-[25%] min-w-[200px]'
                required
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
                        className='max-w-[25%] min-w-[200px]'
                        required
                    />
                <div className="text-lg text-slate-800">
                    What is the objective for this portfolio?
                </div>
                <ObjectiveSelector handleChange={handleChange} value={data.objective || ""} />
            </>
            )}
            <div className="w-full flex justify-end px-16">
                {loading? (
                <Button type="button" disabled className="cursor-progress">
                    Please wait...
                </Button>
                ) : (
                <Button type="submit">
                    Submit
                </Button>
                )}
            </div>
        </form>
    )
}