"use client";
import React, { createContext, useState, useEffect, } from "react";

import { getUserSession } from "./auth.js";


export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [userID, setUserID] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(async () => {
        let d = await getUserSession();

        setUserID(d.session.user.id);
        setAccessToken(d.session.access_token);
    }, []);

    return (
        <GlobalContext.Provider value={{
            userID: userID,
            accessToken: accessToken
        }}>
            {children}
        </GlobalContext.Provider>
    )
}
