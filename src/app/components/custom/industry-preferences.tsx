"use client";
import { ScrollArea } from "@/components/ui/scroll-area";

import { cn } from "@/components/lib/utils";

import { Preferences } from "@/types/types";

const SECTORS = [
  {
    name: 'Financials',
    key: 'financial-services',
  },
  {
    name: 'Energy',
    key: 'energy',
  },
  {
    name: 'Materials',
    key: 'materials',
  },
  {
    name: 'Consumer Discretionary',
    key: 'consumer-cyclical',
  },
  {
    name: 'Communication Services',
    key: 'communication-services',
  },
  {
    name: 'Industrials',
    key: 'industrials',
  },
  {
    name: 'Consumer Staples',
    key: 'consumer-defensive',
  },
  {
    name: 'Real Estate',
    key: 'real-estate',
  },
  {
    name: 'Technology',
    key: 'technology',
  },
  {
    name: 'Healthcare',
    key: 'healthcare',
  },
  {
    name: 'Utilities',
    key: 'utilities',
  },
  {
    name: 'Lithium',
    key: 'lithium',
  },
  {
    name: 'Green Energy',
    key: 'renewables',
  },
  {
    name: 'Artificial Intelligence',
    key: 'ai',
  },
  {
    name: 'Pharmaceuticals',
    key: 'pharmaceuticals',
  },
  {
    name: 'Retailers',
    key: 'retail',
  },
  {
    name: 'Banks',
    key: 'banks',
  },
  {
    name: 'Cybersecurity',
    key: 'cybersecurity',
  },
  {
    name: 'Gold',
    key: 'gold',
  },
  {
    name: 'Iron Ore',
    key: 'iron',
  },
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
                "h-[48px] max-w-[280px] flex bg-slate-50 border rounded-full px-3 py-4 text-xs items-center justify-center text-center text-slate-800 cursor-pointer",
                value==="like" && "text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]",
                value==="dislike" && "text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]"
            )}
        >
            {sector.name}
        </div>
    )
}

interface IndustryPreferencesProps {
  value: Preferences
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

    const newValue = { ...value }; // clone preferences

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
        <div className="flex items-center gap-4 mb-12">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex border rounded-full px-3 py-4 text-xs items-center justify-center h-[48px] text-center text-[#13a570] bg-[#edfbee] border-solid border-[#edfbee]">Green</div>
            <span>= like</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="flex border rounded-full px-3 py-4 text-xs items-center justify-center h-[48px] text-center text-[#dc2b2b] bg-[#ffeff0] border-[#ffeff0]">Red</div>
            <span>= dislike</span>
          </div>
        </div>
        <ScrollArea className="h-[480px]">
          <div className="flex flex-wrap text-center items-center justify-center gap-4 sm:gap-8 mx-auto">
            {SECTORS.map((sector, index) => (
                <SectorPrefence 
                    key={index}
                    sector={sector}
                    value={value? value[sector.key]: null}
                    togglePreference={togglePreference}
                />
            ))}
          </div>
        </ScrollArea>
      </div>
  );
}
