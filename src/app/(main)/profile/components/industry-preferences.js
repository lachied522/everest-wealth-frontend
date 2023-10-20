"use client";
import { useGlobalContext } from "@/context/GlobalState";

const SectorPrefence = ({ sectorName, preference, togglePreference }) => {
    const onClick = () => {
      togglePreference({
        sectorName
      });
    }

    let color = "";

    if (preference) {
      color = preference==="like"? "green": "red"
    }

    return (
        <div className={`badge-secondary ${color}`} onClick={onClick}>
            <div>{sectorName}</div>
        </div>
    )
}

export default function IndustryPreferences({ handleChange, value }) {
  const { universeData } = useGlobalContext();
  const sectors = [...new Set(universeData?.map((obj) => obj.sector))];

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
      <div>
        <div className="flex">
          <div className="badge-secondary green">Green</div>
          <div>= like</div>
        </div>
        <div className="flex">
          <div className="badge-secondary red">Red</div>
          <div>= dislike</div>
        </div>
      </div>
      <div className="preferences-container">
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
