"use client";
import { createContext, useState, useContext, useReducer, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import GlobalReducer from "./GlobalReducer";

const GlobalContext = createContext();

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export const GlobalProvider = ({ children, session, userData, universeData }) => {
    const supabase = createClientComponentClient();
    const [portfolioState, portfolioDispatch] = useReducer(GlobalReducer, userData?.portfolios); //use reducer for portfolio data
    const [profileData, setProfileData] = useState(userData?.profiles);
    const [adviceData, setAdviceData] = useState(userData?.advice);

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
        const symbols = Array.from(data, (obj) => { return obj.symbol });

        const universeDataMap = new Map();
        universeData.forEach(stock => {
            if (symbols.includes(stock.symbol)) universeDataMap.set(stock.symbol, stock);
        });

        let totalValue = 0;
        data.forEach(holding => {
            if (universeDataMap.has(holding.symbol)) {
                const price = universeDataMap.get(holding.symbol).last_price;
                totalValue += price * holding.units;
            }
        });

        // update state
        portfolioDispatch({
            type: "UPDATE_DATA",
            payload: {
                id,
                data,
                totalValue,
            },
        });
    }

    const updatePortfolioName = async (id, name) => {
        portfolioDispatch({
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

    const updateProfile = async (profileData) => {
        //update state
        setProfileData(profileData);
        //commit changes to DB
        await commitProfile(profileData)
    }

    const updateAdvice = async (adviceData) => {
        //update state
        setAdviceData(adviceData);
    }

    return (
        <GlobalContext.Provider value={{
            session, 
            portfolioData: portfolioState,
            profileData,
            adviceData,
            universeData,
            updatePortfolio,
            updatePortfolioName,
            updateProfile,
            updateAdvice
        }}>
            {children}
        </GlobalContext.Provider>
    )
}