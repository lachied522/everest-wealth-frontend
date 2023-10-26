"use client";

import { cn } from "@/components/lib/utils";


import { useGlobalContext } from "@/context/GlobalState";

const SectorPrefence = ({ sectorName, preference, togglePreference }) => {
    const onClick = () => {
      togglePreference({
        sectorName
      });
    }

    return (
        <div className={cn(
              "flex border rounded-full p-6 text-xs items-center justify-center h-[30px] w-[90px] text-center text-slate-800 cursor-pointer",
              preference==="like" && "text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]",
              preference==="dislike" && "text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]"
          )} onClick={onClick}>
            <div>{sectorName}</div>
        </div>
    )
}

export default function IndustryPreferences({ handleChange, value }) {
  const sectors = [
    'financials',
    'energy',
    'materials',
    'consumer discretionary',
    'communication services',
    'industrials',
    'consumer staples',
    'real estate',
    'information technology',
    'health care',
    'utilities'
  ]

  const togglePreference = ({ sectorName }) => {
    const newValue = {...value}; //clone preferences
    switch (preferences[sectorName]) {
      case 'like': 
        newValue[sectorName] = 'dislike';
        break;
      case 'dislike': 
        delete newValue[sectorName];
        break;
      default:
        newValue[sectorName] = 'like';
    }

    handleChange({
      name: "preferences",
      value: newValue,
    });
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <div className="flex border rounded-full px-2.5 py-2 text-xs items-center justify-center h-[30px] w-[90px] text-center text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]">Green</div>
          <span>=</span>
          <span>like</span>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex border rounded-full px-2.5 py-2 text-xs items-center justify-center h-[30px] w-[90px] text-center text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]">Red</div>
          <span>=</span>
          <span>dislike</span>
        </div>
      </div>
      <div className="flex flex-wrap max-w-[80%] gap-4 text-center justify-center items-center justify-items-center p-1.5">
        {sectors.map((sectorName, index) => (
            <SectorPrefence 
                key={index}
                sectorName={sectorName}
                preference={value? value[sectorName]: null}
                togglePreference={togglePreference}
            />
        ))}
      </div>
    </>
  );
}
