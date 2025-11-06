import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDhikrTrackingSync = () => {
  const { user } = useAuth();
  const [dhikrData, setDhikrData] = useState<any>({});

  useEffect(() => {
    if (user) {
      loadDhikrData();
    } else {
      // Load from localStorage if not authenticated
      const stored = localStorage.getItem("dhikrTracking");
      if (stored) {
        setDhikrData(JSON.parse(stored));
      }
    }
  }, [user]);

  const loadDhikrData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("dhikr_tracking")
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
        formatted[dateKey][item.prayer_name] = item.completed;
      });

      setDhikrData(formatted);
    } catch (error) {
      // Silent fail - data will be loaded from localStorage
    }
  };

  const toggleDhikr = async (date: string, prayerName: string) => {
    const newStatus = !dhikrData[date]?.[prayerName];

    if (user) {
      // Save to Supabase
      try {
        const { error } = await supabase
          .from("dhikr_tracking")
          .upsert({
            user_id: user.id,
            prayer_date: date,
            prayer_name: prayerName,
            completed: newStatus,
          }, {
            onConflict: "user_id,prayer_date,prayer_name",
          });

        if (error) throw error;
      } catch (error) {
        // Silent fail - data will be saved to localStorage
      }
    }

    // Update local state
    const newData = {
      ...dhikrData,
      [date]: {
        ...dhikrData[date],
        [prayerName]: newStatus,
      },
    };
    setDhikrData(newData);
    
    // Also save to localStorage as backup
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