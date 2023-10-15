"use client";
import { useState, useEffect } from "react";

import { useGlobalContext } from "@/context/GlobalState";
import Popup from "@/components/popup";

const WEB_SERVER_BASE_URL = process.env.NEXT_PUBLIC_WEB_SERVER_BASE_URL;

const USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

function getNewAdvice(data, session) {
    const url = `${WEB_SERVER_BASE_URL}/new_advice/${session.user.id}`;
    try {
        fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                token: session.access_token,
            }
        })
        .then(response => response.json())
        .then(data => console.log(data));
    } catch {
        //pass
    }
}    

export default function NewAdvicePopup({ isOpen, setIsOpen, portfolio }) {
    const { session } = useGlobalContext(); //raw portfolio data
    const [adviceType, setAdviceType] = useState(''); //none, deposit, withdraw
    const [amount, setAmount] = useState(0);
    
    //calculate current portfolio value
    
    const [currentValue, setCurrentValue] = useState(0)
    const [proposedValue, setProposedValue] = useState(0);

    useEffect(() => {
        const v = portfolio?.data?.reduce((acc, obj) => acc + parseFloat(obj.value), 0) || 0;
        setCurrentValue(v);
        setProposedValue(v);
        setAmount(0);
    }, [portfolio]);

    useEffect(() => {
        if (adviceType === 'withdraw') {
            setProposedValue(Math.max(currentValue - parseFloat(amount), 0));
        } else {
            setProposedValue(currentValue + parseFloat(amount));
        }
    }, [adviceType, amount]);

    const closePopup = () => {
        setIsOpen(false);
    };

    const onChange = (e) => {
        const input = e.target.value;
        setAmount(parseFloat(input));
    }

    const onSubmit = () => {
        getNewAdvice({
            value: proposedValue,
            reason: adviceType,
            portfolio_id: portfolio.id,
        }, session);
        //closePopup();
    }

    if (isOpen) {
        return (
            <Popup
                title="Get Advice" closePopup={closePopup}
            >
                <form>
                    <div
                        id="w-node-e5b938e9-80a4-3dde-e250-a9a1ea4afd22-2fdc3ff5"
                        className="get-advice-container"
                    >
                        <div className="text-300 color-neutral-700">
                            What would you like to do?
                        </div>
                        <div
                            className="w-tabs"
                        >
                        <div className="get-advice-tab-menu w-tab-menu">
                            <a
                                className={"tab-link w-inline-block w-tab-link" + (adviceType==='deposit'? " w--current": "")}
                                onClick={() => {setAdviceType('deposit')}}
                            >
                            <div>Invest some money</div>
                            </a>
                            <a
                                className={"tab-link w-inline-block w-tab-link" + (adviceType==='withdraw'? " w--current": "")}
                                onClick={() => {setAdviceType('withdraw')}}
                            >
                            <div>Make a withdrawal</div>
                            </a>
                        </div>
                        <div className="w-tab-content">
                            {adviceType==='' && (<div data-w-tab="None" className="w-tab-pane"></div>)}
                            {adviceType!=='' && (<div
                                className="w-tab-pane w--tab-active"
                            >
                            <div className="w-form">
                                <div
                                    method="get"
                                    className="get-advice-form"
                                >
                                <label htmlFor="field-2">Amount to {adviceType}</label>
                                <div className="flex align-center gap-column-12px mg-bottom-24px">
                                    <div className="text-300">$</div>
                                    <input
                                        type="number"
                                        className="input small w-input"
                                        maxLength="256"
                                        name="amount"
                                        min="0"
                                        placeholder="e.g. 1000"
                                        value={amount}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
                                <div className="grid-2-columns">
                                    <div className="text-200 color-neutral-700">
                                        Impied portfolio value
                                    </div>
                                    <div className="portfolio-value">
                                        {USDollar.format(proposedValue)}
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>)}
                        </div>
                        </div>
                    </div>
                    <div className="grid-2-columns gap-18px _2-columns-mbl">
                        <button
                            type="button"
                            className="btn-secondary small w-button"
                            onClick={closePopup}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn-primary small w-node-eeb57ff6-678d-99bd-3a14-ccd27109b43d-2fdc3ff5 w-button"
                            onClick={onSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </Popup>
        )
    }
}