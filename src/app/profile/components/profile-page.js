"use client";
import React, { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useGlobalContext } from "@/context/GlobalState";
import UserProfile from "./user-profile";
import styles from "./profile-page.module.css";

export default function ProfilePage() {
  const { profileData, handleProfileChange } = useGlobalContext();
  const [edit, setEdit] = useState(false); //defines whether user is in edit mode

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleSave = () => {
    setEdit(false);
    //upsert data to DB
    console.log(profileData);
  };

  return (
    <>
      <div className="container-default w-container">
        <div className={styles["profile-top-container"]}>
          <img
            src="https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg"
            loading="eager"
            sizes="(max-width: 767px) 100vw, (max-width: 991px) 96vw, (max-width: 1439px) 79vw, 1044px"
            srcSet="
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-500.jpeg   500w,
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-800.jpeg   800w,
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1080.jpeg 1080w,
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-1600.jpeg 1600w,
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template-p-2000.jpeg 2000w,
                  https://uploads-ssl.webflow.com/64afbac816bb17eb2fdc3f03/64afbac916bb17eb2fdc40b7_profile-bg-banner-medium-dashboardly-webflow-template.jpg         2088w
                "
            alt=""
            className={styles["profile-bg-banner-image"]}
          />
          <div className={styles["profile-bg-banner-gradient"]} />
          <div className={styles["profile-name-container"]}>
            <div className="flex align-center">
              <div>
                <div className="heading-h3-size color-neutral-100 mg-bottom-8px">
                  John Carter
                </div>
                <div className="heading-h5-size color-neutral-100 opacity-80">
                  CEO at Dashly X
                </div>
              </div>
            </div>
            {edit ? (
              <button className="btn-secondary small" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button className="btn-secondary small" onClick={handleEditClick}>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <UserProfile
        data={profileData}
        handleProfileChange={handleProfileChange}
        edit={edit}
      />
    </>
  );
}
