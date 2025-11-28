import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook pour le suivi des dhikr avec synchronisation Supabase
 *
 * Comportement identique à usePrayerTrackingSync:
 * - Utilisateur connecté: Données dans Supabase (par user_id)
 * - Utilisateur non connecté: Données dans localStorage uniquement
 * - Changement de compte: Chaque utilisateur voit ses propres données
 */
export const useDhikrTrackingSync = () => {
  const { user } = useAuth();
  const [dhikrData, setDhikrData] = useState<any>({});

  useEffect(() => {
    if (user) {
      // Utilisateur connecté: Charger depuis Supabase
      loadDhikrDataFromSupabase();
      // Nettoyer localStorage pour éviter les conflits
      localStorage.removeItem("dhikrTracking");
    } else {
      // Utilisateur non connecté: Charger depuis localStorage
      loadDhikrDataFromLocalStorage();
    }
  }, [user?.id]); // Important: user?.id pour détecter le changement de compte

  const loadDhikrDataFromSupabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("dhikr_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("prayer_date", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des dhikr depuis Supabase:", error);
        throw error;
      }

      // Convertir au format attendu par l'app
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
      console.error("Échec du chargement des dhikr:", error);
      setDhikrData({});
    }
  };

  const loadDhikrDataFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("dhikrTracking");
      if (stored) {
        setDhikrData(JSON.parse(stored));
      } else {
        setDhikrData({});
      }
    } catch (error) {
      console.error("Erreur lors du chargement des dhikr depuis localStorage:", error);
      setDhikrData({});
    }
  };

  const toggleDhikr = async (date: string, prayerName: string) => {
    const newStatus = !dhikrData[date]?.[prayerName];

    if (user) {
      // Utilisateur connecté: Sauvegarder dans Supabase
      try {
        const { error } = await supabase
          .from("dhikr_tracking")
          .upsert({
            user_id: user.id,
            prayer_date: date,
            prayer_name: prayerName,
            completed: newStatus,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id,prayer_date,prayer_name",
          });

        if (error) {
          console.error("Erreur lors de la sauvegarde du dhikr dans Supabase:", error);
          throw error;
        }
      } catch (error) {
        console.error("Échec de la sauvegarde du dhikr:", error);
        return;
      }
    }

    // Mettre à jour l'état local
    const newData = {
      ...dhikrData,
      [date]: {
        ...dhikrData[date],
        [prayerName]: newStatus,
      },
    };
    setDhikrData(newData);

    // Sauvegarder dans localStorage UNIQUEMENT si non connecté
    if (!user) {
      localStorage.setItem("dhikrTracking", JSON.stringify(newData));
    }
  };

  const getDhikrStatus = useCallback((date: string, prayerName: string): boolean => {
    return dhikrData[date]?.[prayerName] || false;
  }, [dhikrData]); // Re-create when dhikrData changes

  return {
    toggleDhikr,
    getDhikrStatus,
  };
};
