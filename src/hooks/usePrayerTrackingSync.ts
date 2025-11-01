import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PrayerStatus } from "./usePrayerTracking";

export const usePrayerTrackingSync = () => {
  const { user } = useAuth();
  const [prayerData, setPrayerData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPrayerData();
    } else {
      // Load from localStorage if not authenticated
      const stored = localStorage.getItem("prayerTracking");
      if (stored) {
        setPrayerData(JSON.parse(stored));
      }
      setLoading(false);
    }
  }, [user]);

  const loadPrayerData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("prayer_tracking")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Convert to the format expected by the app
      const formatted: any = {};
      data?.forEach((item) => {
        const dateKey = item.prayer_date;
        if (!formatted[dateKey]) {
          formatted[dateKey] = {};
        }
        formatted[dateKey][item.prayer_name] = item.status;
      });

      setPrayerData(formatted);
      setLoading(false);
    } catch (error) {
      console.error("Error loading prayer data:", error);
      setLoading(false);
    }
  };

  const updatePrayerStatus = async (date: string, prayerName: string, status: PrayerStatus) => {
    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from("prayer_tracking")
          .upsert({
            user_id: user.id,
            prayer_date: date,
            prayer_name: prayerName,
            status,
          }, {
            onConflict: "user_id,prayer_date,prayer_name",
          });

        if (error) throw error;
      } catch (error) {
        console.error("Error updating prayer status:", error);
      }
    }

    // Update local state
    const newData = {
      ...prayerData,
      [date]: {
        ...prayerData[date],
        [prayerName]: status,
      },
    };
    setPrayerData(newData);
    
    // Also save to localStorage as backup
    localStorage.setItem("prayerTracking", JSON.stringify(newData));
  };

  const deletePrayerStatus = async (date: string, prayerName: string) => {
    if (user) {
      // Delete from Supabase
      try {
        const { error } = await supabase
          .from("prayer_tracking")
          .delete()
          .eq("user_id", user.id)
          .eq("prayer_date", date)
          .eq("prayer_name", prayerName);

        if (error) throw error;
      } catch (error) {
        console.error("Error deleting prayer status:", error);
      }
    }

    // Update local state
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

  const getCustomStats = (startDate: Date, endDate: Date) => {
    let onTime = 0;
    let late = 0;
    let missed = 0;
    let total = 0;

    Object.keys(prayerData).forEach((dateStr) => {
      const date = new Date(dateStr);
      if (date >= startDate && date <= endDate) {
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
    getCustomStats,
    loading,
  };
};