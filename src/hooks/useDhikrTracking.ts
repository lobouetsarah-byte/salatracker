import { useState, useEffect } from "react";

interface DhikrData {
  [date: string]: {
    [prayerName: string]: boolean;
  };
}

export const useDhikrTracking = () => {
  const [dhikrData, setDhikrData] = useState<DhikrData>({});

  useEffect(() => {
    const stored = localStorage.getItem("dhikrTracking");
    if (stored) {
      setDhikrData(JSON.parse(stored));
    }
  }, []);

  const toggleDhikr = (date: string, prayerName: string) => {
    const newData = {
      ...dhikrData,
      [date]: {
        ...dhikrData[date],
        [prayerName]: !dhikrData[date]?.[prayerName],
      },
    };
    setDhikrData(newData);
    localStorage.setItem("dhikrTracking", JSON.stringify(newData));
  };

  const getDhikrStatus = (date: string, prayerName: string): boolean => {
    return dhikrData[date]?.[prayerName] || false;
  };

  return {
    toggleDhikr,
    getDhikrStatus,
  };
};
