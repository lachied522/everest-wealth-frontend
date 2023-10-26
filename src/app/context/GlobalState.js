"use client";
import { createContext, useState, useContext, useReducer, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import GlobalReducer from "./GlobalReducer";

const GlobalContext = createContext();

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export const GlobalProvider = ({ children, session, userData, universeDataMap }) => {
    const supabase = createClientComponentClient();
    const [state, dispatch] = useReducer(GlobalReducer, userData); //use reducer for portfolio data

    const commitPortfolio = async (portfolioData) => {
        if (!session) return;
        const { data, error } = await supabase
        .from('users')
        .update({ portfolio: portfolioData })
        .eq('id', session.user.id)
        .select();

        if (error) console.log(`Error committing changes: ${error}`);
    }
   
    const updatePortfolio = (id, data) => {
        // calculate total portfolio values
        let totalValue = 0;
        data.forEach(holding => {
            if (universeDataMap.has(holding.symbol)) {
                const price = universeDataMap.get(holding.symbol).last_price;
                totalValue += price * holding.units;
            }
        });

        // update state
        dispatch({
            type: "UPDATE_DATA",
            payload: {
                id,
                data,
                totalValue,
            },
        });
    }

    const toggleFavourite = async (id) => {
        dispatch({
            type: "TOGGLE_FAVOURITE",
            payload: {
                id
            }
        });

        // update DB
        if (!session) return;
        const { data, error } = await supabase.rpc('toggle_locked', { holding_id: id });

        if (error) console.log(`Error committing changes: ${error}`);
    }

    const updateAdvice = async (adviceData) => {
        //update state
        
    }


    const updatePortfolioName = async (id, name) => {
        dispatch({
            type: 'UPDATE_NAME',
            payload: {
                id,
                name,
            },
        });
        //commit to DB
        const { data, error } = await supabase
        .from('portfolios')
        .update({ name: name })
        .eq('id', id)
        .select();

        if (error) console.log(`Error committing changes: ${error}`);
    }

    const commitProfile = async (profileData) => {
        const profileCopy = {...profileData}; //create copy of profile
        delete profileCopy['id']; //delete id from profile
        if (!session) return;
        const { data, error } = await supabase
        .from('profiles')
        .insert({
            ...profileCopy,
            'user_id': session.user.id
        })
        .select();

        if (error) console.log(error);
    }

    return (
        <GlobalContext.Provider value={{
            session, 
            portfolioData: state,
            updatePortfolio,
            toggleFavourite,
            updatePortfolioName,
            updateAdvice
        }}>
            {children}
        </GlobalContext.Provider>
    )
}