import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BadgeData {
  id: string;
  badge_name: string;
  badge_type: string;
  badge_description: string;
  earned_at: string;
}

export const useBadges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [badges, setBadges] = useState<BadgeData[]>([]);

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error("Error loading badges:", error);
    }
  };

  const checkAndAwardBadge = async (badgeType: string, badgeName: string, description: string) => {
    if (!user) return false;

    try {
      // Check if badge already exists
      const { data: existing } = await supabase
        .from("badges")
        .select("*")
        .eq("user_id", user.id)
        .eq("badge_type", badgeType)
        .eq("badge_name", badgeName)
        .maybeSingle();

      if (existing) return false;

      // Award new badge
      const { error } = await supabase
        .from("badges")
        .insert({
          user_id: user.id,
          badge_name: badgeName,
          badge_type: badgeType,
          badge_description: description,
        });

      if (error) throw error;

      toast({
        title: "🎉 Nouveau badge !",
        description: `${badgeName} : ${description}`,
        duration: 5000,
      });

      await loadBadges();
      return true;
    } catch (error) {
      console.error("Error awarding badge:", error);
      return false;
    }
  };

  const checkDailyCompletion = async (date: string, isInPeriod: boolean) => {
    if (!user) return false;

    const prayers = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    try {
      if (isInPeriod) {
        // Check if all prayers have a spiritual act
        const { data } = await supabase
          .from("dhikr_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq("prayer_date", date);

        const completedCount = data?.length || 0;
        return completedCount >= 5;
      } else {
        // Check if all prayers are on-time
        const { data } = await supabase
          .from("prayer_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq("prayer_date", date)
          .eq("status", "on-time");

        const onTimeCount = data?.length || 0;
        return onTimeCount >= 5;
      }
    } catch (error) {
      console.error("Error checking daily completion:", error);
      return false;
    }
  };

  const checkWeeklyStreak = async (prayerName: string, isInPeriod: boolean) => {
    if (!user) return 0;

    try {
      const today = new Date();
      const dates = [];
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      if (isInPeriod) {
        const { data } = await supabase
          .from("dhikr_tracking")
          .select("prayer_date")
          .eq("user_id", user.id)
          .eq("prayer_name", prayerName)
          .in("prayer_date", dates);

        return data?.length || 0;
      } else {
        const { data } = await supabase
          .from("prayer_tracking")
          .select("prayer_date")
          .eq("user_id", user.id)
          .eq("prayer_name", prayerName)
          .eq("status", "on-time")
          .in("prayer_date", dates);

        return data?.length || 0;
      }
    } catch (error) {
      console.error("Error checking weekly streak:", error);
      return 0;
    }
  };

  const checkWeeklyBadges = async (isInPeriod: boolean) => {
    if (!user) return;

    const prayers = [
      { name: "Fajr", badge: "🌕 Gardienne de l'Aube", desc: "7 Fajr à l'heure consécutifs" },
      { name: "Dhuhr", badge: "☀️ Discipline du Milieu", desc: "7 Dhuhr à l'heure consécutifs" },
      { name: "Asr", badge: "🌤 Constante de l'Après-midi", desc: "7 Asr à l'heure consécutifs" },
      { name: "Maghrib", badge: "🌅 Fidèle du Crépuscule", desc: "7 Maghrib à l'heure consécutifs" },
      { name: "Isha", badge: "✨ Sérénité Nocturne", desc: "7 Isha à l'heure consécutifs" },
    ];

    for (const prayer of prayers) {
      const streak = await checkWeeklyStreak(prayer.name, isInPeriod);
      if (streak >= 7) {
        await checkAndAwardBadge(`weekly_${prayer.name.toLowerCase()}`, prayer.badge, prayer.desc);
      }
    }

    // Check full week
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }

    let allDaysComplete = true;
    for (const date of dates) {
      const isComplete = await checkDailyCompletion(date, isInPeriod);
      if (!isComplete) {
        allDaysComplete = false;
        break;
      }
    }

    if (allDaysComplete) {
      await checkAndAwardBadge(
        "weekly_full",
        "💎 Semaine Parfaite",
        "7 jours consécutifs de dévotion complète"
      );
    }
  };

  return {
    badges,
    checkDailyCompletion,
    checkWeeklyBadges,
    checkAndAwardBadge,
  };
};
