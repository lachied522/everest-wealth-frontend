"use client";

import { cn } from "@/components/lib/utils";


interface SectorPrefenceProps {
  sectorName: string
  value: 'like' | 'dislike' | null
  togglePreference: (sectorName: string) => void
}

const SectorPrefence = ({ sectorName, value, togglePreference }: SectorPrefenceProps) => {
    const onClick = () => {
      togglePreference(sectorName);
    }

    return (
        <div 
          onClick={onClick}
          className={cn(
                "flex flex-1 border rounded-full p-6 text-xs items-center justify-center h-[30px] max-w-[160px] text-center text-slate-800 cursor-pointer",
                value==="like" && "text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]",
                value==="dislike" && "text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]"
            )}
        >
            {sectorName}
        </div>
    )
}

type Preferences = {
  [key: string]: 'like' | 'dislike'
}

interface IndustryPreferencesProps {
  value:  Preferences | null
  handleChange: (event: any) => void
}

export default function IndustryPreferences({ value, handleChange }: IndustryPreferencesProps) {
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

  const togglePreference = (sectorName: string) => {
    if (!value) {
      handleChange({
        [sectorName]: 'like'
      })
      return;
    }

    const newValue = {...value}; // clone preferences

    switch (value[sectorName]) {
      case 'like': 
        newValue[sectorName] = 'dislike';
        break;
      case 'dislike': 
        delete newValue[sectorName];
        break;
      default:
        newValue[sectorName] = 'like';
    }

    handleChange(newValue);
  }

  return (
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-start gap-2">
            <div className="flex border rounded-full px-2.5 py-2 text-xs items-center justify-center h-[30px] w-[160px] text-center text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]">Green</div>
            <span>=</span>
            <span>like</span>
          </div>
          <div className="flex items-center justify-start gap-2">
            <div className="flex border rounded-full px-2.5 py-2 text-xs items-center justify-center h-[30px] w-[160px] text-center text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]">Red</div>
            <span>=</span>
            <span>dislike</span>
          </div>
        </div>  
        <div className="flex flex-wrap max-w-[80%] gap-4 text-center justify-center items-center p-2">
          {sectors.map((sectorName, index) => (
              <SectorPrefence 
                  key={index}
                  sectorName={sectorName}
                  value={value? value[sectorName]: null}
                  togglePreference={togglePreference}
              />
          ))}
        </div>
      </div>
  );
}
