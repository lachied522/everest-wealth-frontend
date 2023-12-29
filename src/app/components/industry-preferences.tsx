"use client";
import { cn } from "@/components/lib/utils";

import { Preferences } from "@/types/types";

const SECTORS = [
  {
    name: 'financials',
    key: 'financials',
  },
  {
    name: 'energy',
    key: 'energy',
  },
  {
    name: 'materials',
    key: 'materials',
  },
  {
    name: 'consumer discretionary',
    key: 'consumer-cyclical',
  },
  {
    name: 'communication services',
    key: 'communication-services',
  },
  {
    name: 'industrials',
    key: 'industrials',
  },
  {
    name: 'consumer staples',
    key: 'consumer-defensive',
  },
  {
    name: 'real estate',
    key: 'real-estate',
  },
  {
    name: 'technology',
    key: 'technology',
  },
  {
    name: 'healthcare',
    key: 'healthcare',
  },
  {
    name: 'utilities',
    key: 'utilities',
  }
]

interface SectorPrefenceProps {
  sector: typeof SECTORS[number]
  value: 'like' | 'dislike' | null
  togglePreference: (sector: typeof SECTORS[number]) => void
}

const SectorPrefence = ({ sector, value, togglePreference }: SectorPrefenceProps) => {
    const onClick = () => {
      togglePreference(sector);
    }

    return (
        <div 
          onClick={onClick}
          className={cn(
                "flex flex-1 border rounded-full px-2 py-4 text-xs items-center justify-center h-[36px] max-w-[160px] text-center text-slate-800 cursor-pointer",
                value==="like" && "text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]",
                value==="dislike" && "text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]"
            )}
        >
            {sector.name}
        </div>
    )
}

interface IndustryPreferencesProps {
  value:  Preferences
  handleChange: (event: any) => void
}

export default function IndustryPreferences({ value, handleChange }: IndustryPreferencesProps) {
  const togglePreference = (sector: typeof SECTORS[number]) => {
    if (!value) {
      handleChange({
        [sector.key]: 'like'
      })
      return;
    }

    const newValue = {...value}; // clone preferences

    switch (value[sector.key]) {
      case 'like': 
        newValue[sector.key] = 'dislike';
        break;
      case 'dislike': 
        delete newValue[sector.key];
        break;
      default:
        newValue[sector.key] = 'like';
    }

    handleChange(newValue);
  }

  return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4 mb-8">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex border rounded-full px-2 py-4 text-xs items-center justify-center h-[36px] text-center text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]">Green</div>
            <span>= like</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex border rounded-full px-2 py-4 text-xs items-center justify-center h-[36px] text-center text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]">Red</div>
            <span>= dislike</span>
          </div>
        </div>  
        <div className="flex flex-wrap max-w-[80%] gap-4 text-center justify-center items-center">
          {SECTORS.map((sector, index) => (
              <SectorPrefence 
                  key={index}
                  sector={sector}
                  value={value? value[sector.key]: null}
                  togglePreference={togglePreference}
              />
          ))}
        </div>
      </div>
  );
}
