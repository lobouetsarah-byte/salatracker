import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PrayerStatus } from "./usePrayerTracking";

/**
 * Hook pour le suivi des prières avec synchronisation Supabase
 *
 * Comportement:
 * - Utilisateur connecté: Données stockées dans Supabase (par user_id)
 * - Utilisateur non connecté: Données stockées dans localStorage uniquement
 * - Changement de compte: Chaque utilisateur voit SEULEMENT ses propres données
 * - localStorage est effacé lors de la connexion/déconnexion pour éviter les conflits
 */
export const usePrayerTrackingSync = () => {
  const { user } = useAuth();
  const [prayerData, setPrayerData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Charger les données au montage et lors du changement d'utilisateur
  useEffect(() => {
    if (user) {
      // Utilisateur connecté: Charger depuis Supabase
      loadPrayerDataFromSupabase();
      // Nettoyer le localStorage pour éviter les conflits entre comptes
      localStorage.removeItem("prayerTracking");
    } else {
      // Utilisateur non connecté: Charger depuis localStorage
      loadPrayerDataFromLocalStorage();
    }
  }, [user?.id]); // Important: user?.id pour détecter le changement de compte

  /**
   * Charger les données depuis Supabase (utilisateur connecté)
   */
  const loadPrayerDataFromSupabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("prayer_tracking")
        .select("*")
        .eq("user_id", user.id)
        .order("prayer_date", { ascending: false });

      if (error) {
        console.error("Erreur lors du chargement des prières depuis Supabase:", error);
        throw error;
      }

      // Convertir au format attendu par l'app
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
      console.error("Échec du chargement des données de prière:", error);
      setPrayerData({});
      setLoading(false);
    }
  };

  /**
   * Charger les données depuis localStorage (utilisateur non connecté)
   */
  const loadPrayerDataFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem("prayerTracking");
      if (stored) {
        setPrayerData(JSON.parse(stored));
      } else {
        setPrayerData({});
      }
    } catch (error) {
      console.error("Erreur lors du chargement depuis localStorage:", error);
      setPrayerData({});
    }
    setLoading(false);
  };

  /**
   * Mettre à jour le statut d'une prière
   */
  const updatePrayerStatus = async (date: string, prayerName: string, status: PrayerStatus) => {
    if (user) {
      // Utilisateur connecté: Sauvegarder dans Supabase
      try {
        const { error } = await supabase
          .from("prayer_tracking")
          .upsert({
            user_id: user.id,
            prayer_date: date,
            prayer_name: prayerName,
            status,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: "user_id,prayer_date,prayer_name",
          });

        if (error) {
          console.error("Erreur lors de la sauvegarde dans Supabase:", error);
          throw error;
        }
      } catch (error) {
        console.error("Échec de la sauvegarde de la prière:", error);
        // Ne pas continuer si la sauvegarde échoue pour un utilisateur connecté
        return;
      }
    }

    // Mettre à jour l'état local
    const newData = {
      ...prayerData,
      [date]: {
        ...prayerData[date],
        [prayerName]: status,
      },
    };
    setPrayerData(newData);

    // Sauvegarder dans localStorage UNIQUEMENT si non connecté
    if (!user) {
      localStorage.setItem("prayerTracking", JSON.stringify(newData));
    }
  };

  /**
   * Supprimer le statut d'une prière
   */
  const deletePrayerStatus = async (date: string, prayerName: string) => {
    if (user) {
      // Utilisateur connecté: Supprimer de Supabase
      try {
        const { error } = await supabase
          .from("prayer_tracking")
          .delete()
          .eq("user_id", user.id)
          .eq("prayer_date", date)
          .eq("prayer_name", prayerName);

        if (error) {
          console.error("Erreur lors de la suppression dans Supabase:", error);
          throw error;
        }
      } catch (error) {
        console.error("Échec de la suppression de la prière:", error);
        return;
      }
    }

    // Mettre à jour l'état local
    if (prayerData[date]) {
      const newDateData = { ...prayerData[date] };
      delete newDateData[prayerName];

      const newData = {
        ...prayerData,
        [date]: newDateData,
      };
      setPrayerData(newData);

      // Sauvegarder dans localStorage UNIQUEMENT si non connecté
      if (!user) {
        localStorage.setItem("prayerTracking", JSON.stringify(newData));
      }
    }
  };

  /**
   * Obtenir le statut d'une prière
   * Wrapped in useCallback to ensure stable reference and proper reactivity
   */
  const getPrayerStatus = useCallback((date: string, prayerName: string): PrayerStatus => {
    return prayerData[date]?.[prayerName] || "pending";
  }, [prayerData]); // Re-create when prayerData changes

  /**
   * Obtenir les statistiques pour une période
   */
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

  /**
   * Obtenir les statistiques personnalisées
   */
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
