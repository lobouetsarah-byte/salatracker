import { useState, useEffect } from "react";

export type PrayerStatus = "pending" | "on-time" | "late" | "missed";

interface PrayerTrackingData {
  [date: string]: {
    [prayerName: string]: PrayerStatus;
  };
}

export const usePrayerTracking = () => {
  const [prayerData, setPrayerData] = useState<PrayerTrackingData>({});

  useEffect(() => {
    const stored = localStorage.getItem("prayerTracking");
    if (stored) {
      setPrayerData(JSON.parse(stored));
    }
  }, []);

  const updatePrayerStatus = (date: string, prayerName: string, status: PrayerStatus) => {
    const newData = {
      ...prayerData,
      [date]: {
        ...prayerData[date],
        [prayerName]: status,
      },
    };
    setPrayerData(newData);
    localStorage.setItem("prayerTracking", JSON.stringify(newData));
  };

  const getPrayerStatus = (date: string, prayerName: string): PrayerStatus => {
    return prayerData[date]?.[prayerName] || "pending";
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let onTime = 0;
    let late = 0;
    let missed = 0;
    let total = 0;

    Object.keys(prayerData).forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date >= weekAgo && date <= today) {
        Object.values(prayerData[dateStr]).forEach((status) => {
          total++;
          if (status === "on-time") onTime++;
          else if (status === "late") late++;
          else if (status === "missed") missed++;
        });
      }
    });

    return { onTime, late, missed, total };
  };

  return {
    updatePrayerStatus,
    getPrayerStatus,
    getWeeklyStats,
  };
};
