"use client";
import { createContext, useContext, useState } from "react";

const ProfileContext = createContext();

export const useProfileContext = () => {
    return useContext(ProfileContext);
}

export const ProfileProvider = ({ children, initialState }) => {
    const [profileData, setProfileData] = useState(initialState);

    const updateProfile = ({ name, value }) => {
        setProfileData((prevData) => ({
          ...prevData,
          [name]: value
        }));
    }
    
    return (
        <ProfileContext.Provider value={{ profileData, updateProfile }}>
            {children}
        </ProfileContext.Provider>
    )
}