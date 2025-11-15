import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type DhikrType = "dhikr" | "invocation" | "remembrance";

interface PeriodDhikr {
  date: string;
  prayerName: string;
  dhikrType: DhikrType;
}

export const usePeriodDhikrTracking = () => {
  const { user } = useAuth();
  const [dhikrData, setDhikrData] = useState<Record<string, Record<string, DhikrType | null>>>({});

  useEffect(() => {
    if (user) {
      loadDhikrData();
    } else {
      // Load from localStorage if not authenticated
      const stored = localStorage.getItem("periodDhikrTracking");
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
      const formatted: Record<string, Record<string, DhikrType | null>> = {};
      data?.forEach((item) => {
        const dateKey = item.prayer_date;
        if (!formatted[dateKey]) {
          formatted[dateKey] = {};
        }
        // We'll store the dhikr type in the prayer_name field temporarily
        // This is a workaround since we're using the existing dhikr_tracking table
        formatted[dateKey][item.prayer_name] = item.completed ? "dhikr" : null;
      });

      setDhikrData(formatted);
    } catch (error) {
      console.error("Error loading dhikr data:", error);
    }
  };

  const setDhikrForPrayer = async (date: string, prayerName: string, dhikrType: DhikrType | null) => {
    if (user) {
      // Save to Supabase
      try {
        if (dhikrType === null) {
          // Delete the entry
          await supabase
            .from("dhikr_tracking")
            .delete()
            .eq("user_id", user.id)
            .eq("prayer_date", date)
            .eq("prayer_name", prayerName);
        } else {
          // Upsert the entry
          const { error } = await supabase
            .from("dhikr_tracking")
            .upsert({
              user_id: user.id,
              prayer_date: date,
              prayer_name: prayerName,
              completed: true, // We mark as completed when any dhikr type is selected
            }, {
              onConflict: "user_id,prayer_date,prayer_name",
            });

          if (error) throw error;
        }
      } catch (error) {
        console.error("Error saving dhikr:", error);
      }
    }

    // Update local state
    const newData = {
      ...dhikrData,
      [date]: {
        ...dhikrData[date],
        [prayerName]: dhikrType,
      },
    };
    setDhikrData(newData);
    
    // Also save to localStorage as backup
    localStorage.setItem("periodDhikrTracking", JSON.stringify(newData));
  };

  const getDhikrForPrayer = (date: string, prayerName: string): DhikrType | null => {
    return dhikrData[date]?.[prayerName] || null;
  };

  return {
    setDhikrForPrayer,
    getDhikrForPrayer,
  };
};
