"use client";
import { createContext, useContext, useReducer } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import PorfolioReducer from "./PortfolioReducer";

const PortfolioContext = createContext();

export const usePortfolioContext = () => {
    return useContext(PortfolioContext);
}

export const PortfolioProvider = ({ children, initialPortfolio, profile, session }) => {
    const supabase = createClientComponentClient();
    const [state, dispatch] = useReducer(PorfolioReducer, initialPortfolio);

    const addHolding = (holding) => {
        dispatch({
            type: "ADD_HOLDING",
            payload: holding,
        });
    }

    const deleteHolding = (holding) => {
        dispatch({
            type: "DELETE_HOLDING",
            payload: holding,
        });
    }

    //TO DO: commit changes after deleteHolding

    const commitChanges = async () => {
        const { data, error } = await supabase
        .from('users')
        .update({ portfolio: state })
        .eq('id', user_id)
        .select();
        if (error) console.log(error);
    }

    return (
        <PortfolioContext.Provider value={{ 
            portfolioData: state,
            profileData: profile,
            session,
            addHolding, 
            deleteHolding, 
            commitChanges
        }}>
            {children}
        </PortfolioContext.Provider>
    )
}