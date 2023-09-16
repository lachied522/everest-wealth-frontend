"use client";
import { createContext, useState, useContext, useReducer, useEffect } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import PorfolioReducer from "./PortfolioReducer";
import { userInfo } from "os";

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
    const [portfolioState, portfolioDispatch] = useReducer(PorfolioReducer, null); //use reducer for portfolio data
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
    }, []);

    useEffect(() => {
        const getData = async () => {
            const [user, universe] = await fetchData(session, supabase);
            //set portfolio state
            portfolioDispatch({
                type: "SET_DATA",
                payload: user[0]['portfolio']
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
    

    const addHolding = (holding) => {
        portfolioDispatch({
            type: "ADD_HOLDING",
            payload: holding,
        });
    }

    const deleteHolding = (holding) => {
        portfolioDispatch({
            type: "DELETE_HOLDING",
            payload: holding,
        });
    }

    const handleProfileChange = ({ name, value }) => {
        setProfileData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }

    //TO DO: commit changes after deleteHolding

    const commitChanges = async () => {
        if (!session) return
        
        const { data, error } = await supabase
        .from('users')
        .update({ portfolio: portfolioState })
        .eq('id', user_id)
        .select();
        if (error) console.log(`Error committing changes: ${error}`);
    }

    return (
        <GlobalContext.Provider value={{
            session, 
            portfolioData: portfolioState,
            profileData,
            adviceData,
            universeData,
            setSession,
            addHolding, 
            deleteHolding, 
            handleProfileChange,
            commitChanges
        }}>
            {children}
        </GlobalContext.Provider>
    )
}