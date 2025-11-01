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

  const deletePrayerStatus = (date: string, prayerName: string) => {
    if (prayerData[date]) {
      const newDateData = { ...prayerData[date] };
      delete newDateData[prayerName];
      
      const newData = {
        ...prayerData,
        [date]: newDateData,
      };
      setPrayerData(newData);
      localStorage.setItem("prayerTracking", JSON.stringify(newData));
    }
  };

  const getPrayerStatus = (date: string, prayerName: string): PrayerStatus => {
    return prayerData[date]?.[prayerName] || "pending";
  };

  const getStats = (period: "daily" | "weekly" | "monthly") => {
    const today = new Date();
    let startDate: Date;

    if (period === "daily") {
      startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "weekly") {
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }
    
    let onTime = 0;
    let late = 0;
    let missed = 0;
    let total = 0;

    Object.keys(prayerData).forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date >= startDate && date <= today) {
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

  const getWeeklyStats = () => getStats("weekly");

  return {
    updatePrayerStatus,
    deletePrayerStatus,
    getPrayerStatus,
    getWeeklyStats,
    getStats,
  };
};
