"use client";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/GlobalState";
import RecommendationsTable from '../../../components/recommendations-table';
import PrevRecommendationsTable from "./prev-recommendations-table";

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

  console.log(adviceData);

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
      <div
        data-w-id="214a1850-0562-14d0-fe09-369daf912b3f"
        className="mg-bottom-32px"
      >
        <div className="grid-2-columns _2-col-mbl _1-col-mbp">
          <div id="w-node-_9a36722d-8aa5-34a7-299c-a8e21ca3d0e7-2fdc3ff5">
            <h1 className="heading-h4-size mg-bottom-12px">Statements</h1>
            <div className="text-400">
              View your Statements of Advice
            </div>
          </div>
        </div>
      </div>
      <RecommendationsTable data={currentRec} />
      <PrevRecommendationsTable data={adviceData?.filter(obj => obj!==currentRec) || []} />
    </div>
  );
}
