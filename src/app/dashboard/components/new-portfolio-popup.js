"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Popup from "@/components/popup";
import ObjectiveSelector from "@/components/objective-selector";

export default function NewPortfolioPopup({ isOpen, setIsOpen, session }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        existing: false,
        value: 0,
        objective: "Long-term/Retirement Savings",
        user_id: session?.user.id,
    });

    const closePopup = () => {
        setIsOpen(false);
    };

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
        const res = await fetch('api/new-portfolio', {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
                token: session.access_token,
            }
        });
        if (res.ok) {
            router.push(res.url);
        }
    }

    if (isOpen) {
        return (
            <Popup title="Open a New Portfolio" closePopup={closePopup}>
                <div className="w-form">
                    <form method="post">
                        <div className="new-portfolio-form">
                            <div className="grid-2-columns _42fr---1fr align-center gap-row-64px">
                                <div className="text-300 color-neutral-700">Portfolio Name</div>
                                <input
                                    type="text"
                                    className="input small w-input"
                                    maxLength="256"
                                    name="name"
                                    data-name="Name"
                                    placeholder=""
                                    value={formData.name || ""}
                                    onChange={onDataChange}
                                />
                                <div className="text-300 color-neutral-700">
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
                            </div>
                            {true && (
                            <>
                                <div className="grid-2-columns _42fr---1fr align-center gap-row-64px">
                                    <div className="text-300 color-neutral-700">
                                        What is the intended value of this portfolio?
                                        </div>
                                        <input
                                            type="number"
                                            className="input small w-input"
                                            maxLength="256"
                                            name="value"
                                            data-name="value"
                                            placeholder=""
                                            value={Math.max(formData.value, 1) || 1}
                                            onChange={onDataChange}
                                        />
                                </div>
                                    <div className="text-300 color-neutral-700">
                                    What is the objective for this portfolio?
                                </div>
                                <ObjectiveSelector handleChange={handleChange} value={formData.objective || ""} />
                            </>
                            )}
                        </div>
                        <div className="grid-2-columns gap-18px _2-columns-mbl">
                            <button
                                className="btn-secondary small w-button"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary small w-button"
                                type="button"
                                onClick={onSubmit}
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                </div>
            </Popup>
        );
    }
}
