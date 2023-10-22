"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalState";
import AllAdviceTable from "./all-advice-table";

const checkDate = (dateTimeString) => {
  const today = new Date();
  const datetime = new Date(dateTimeString);
  return (
    datetime.getDate() == today.getDate() &&
    datetime.getMonth() == today.getMonth() &&
    datetime.getFullYear() == today.getFullYear()
  )
}

export default function StatementsPage() {
  const { adviceData } = useGlobalContext();
  const [currentRec, setCurrentRec] = useState([]); //current recommendations

  //get current recommendations if any
  useEffect(() => {
    if (!adviceData) return;
    const rec = adviceData[0];
    if (checkDate(rec.created_at) && !rec.actioned) {
      //TO DO: populate recommendation data with current price information from universe
      setCurrentRec(rec);
    };
  }, [adviceData]);
  
  return (
    <div className="container-default w-container">
      <div className="mb-6">
        <div className="flex flex-col">
            <h1 className="">Statements</h1>
            <div className="text-lg">
              View your Statements of Advice
            </div>
        </div>
      </div>
      <AllAdviceTable />
    </div>
  );
}
