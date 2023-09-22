"use client";
import { createContext, useState, useContext, useReducer, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import GlobalReducer from "./GlobalReducer";


const parsePortfolioData = (portfolioData) => {
    /**
     * where per share holding data is given, calculate total value
     */ 
    
    const newArray = portfolioData.map(data => {
        const price = data.last_price? data.last_price: data.price; //conform 'last_price' to 'price'
        const totalCost = data.cost? data.cost * data.units: 0;
        const totalProfit = (data.cost? (price - data.cost): price) * data.units;
        return { ...data, price, totalCost, totalProfit };
    });

    return newArray;
}

const fetchData = async (session, supabase) => {
    //fetch universe data
    const { data: universeData, error: universeError } = await supabase
    .from("universe")
    .select("*");
    
    //fetch user data
    const { data: userData, error: userError } = await supabase
    .from("users")
    .select("portfolio, profiles!users_profile_fkey(*), advice(*)")
    .eq("id", session.user.id);
  
    //fetch profile data
    // const { data: profileData, error: profileError } = await supabase
    // .from("profiles")
    // .select("*")
    // .eq("user_id", session.user.id)
    // .order("created_at", { ascending: false })
    // .limit(1);
  
    if (userError) console.log(userError);
    console.log('data fetched');

    return [
      userData, 
      universeData
    ];    
}

const GlobalContext = createContext();

export const useGlobalContext = () => {
    return useContext(GlobalContext);
}

export const GlobalProvider = ({ children }) => {
    const supabase = createClientComponentClient();
    const [session, setSession] = useState(null);
    const [universeData, setUniverseData] = useState(null); 
    const [portfolioState, portfolioDispatch] = useReducer(GlobalReducer, null); //use reducer for portfolio data
    const [profileData, setProfileData] = useState(null);
    const [adviceData, setAdviceData] = useState(null);

    useEffect(() => {
        //get session
        const getSession = async () => {
            const {
                data,
            } = await supabase.auth.getSession();
            setSession(data.session);
        }
        getSession();
    }, [supabase]);

    useEffect(() => {
        const getData = async () => {
            const [user, universe] = await fetchData(session, supabase);
            //set portfolio state
            portfolioDispatch({
                type: "SET_DATA",
                payload: parsePortfolioData(user[0]['portfolio'])
            });
            //set profile data
            setProfileData(user[0]['profiles']);
            //set advice data
            setAdviceData(user[0]['advice']);
            //set universe data
            setUniverseData(universe);
        }

        //if session exists and data is null, fetch data
        if (session && !universeData) {
            getData()
            .catch((e) => console.log(e));
        }
    }, [session]);

    const commitPortfolio = async (portfolioData) => {
        if (!session) return;
        const { data, error } = await supabase
        .from('users')
        .update({ portfolio: portfolioData })
        .eq('id', session.user.id)
        .select();
        
        if (error) console.log(`Error committing changes: ${error}`);
    }
   
    const updatePortfolio = async (portfolioData) => {
        //update state
        portfolioDispatch({
            type: "SET_DATA",
            payload: parsePortfolioData(portfolioData),
        });
        //commit changes to DB
        await commitPortfolio(portfolioData);
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

    return (
        <GlobalContext.Provider value={{
            session, 
            portfolioData: portfolioState,
            profileData,
            adviceData,
            universeData,
            setSession,
            updatePortfolio,
            updateProfile
        }}>
            {children}
        </GlobalContext.Provider>
    )
}