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
      { name: "Dhuhr", badge: "☀️ Constante du Midi", desc: "7 Dhuhr à l'heure consécutifs" },
      { name: "Asr", badge: "🌤 Force de l'Après-Midi", desc: "7 Asr à l'heure consécutifs" },
      { name: "Maghrib", badge: "🌅 Lumière du Couchant", desc: "7 Maghrib à l'heure consécutifs" },
      { name: "Isha", badge: "✨ Paix de la Nuit", desc: "7 Isha à l'heure consécutifs" },
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

  const checkMonthlyBadges = async (isInPeriod: boolean) => {
    if (!user) return;

    try {
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const dates = [];
      for (let d = new Date(firstDayOfMonth); d <= lastDayOfMonth && d <= today; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }

      if (isInPeriod) {
        // Count spiritual acts in the month
        const { data } = await supabase
          .from("dhikr_tracking")
          .select("*")
          .eq("user_id", user.id)
          .in("prayer_date", dates);

        const actCount = data?.length || 0;
        
        if (actCount >= 30) {
          await checkAndAwardBadge(
            "monthly_30_acts",
            "🌸 30 Actes Spirituels",
            "30 actes spirituels accomplis ce mois"
          );
        }
      } else {
        // Count on-time prayers in the month
        const { data } = await supabase
          .from("prayer_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "on-time")
          .in("prayer_date", dates);

        const onTimeCount = data?.length || 0;
        
        if (onTimeCount >= 30) {
          await checkAndAwardBadge(
            "monthly_30_prayers",
            "📿 30 Prières à l'Heure",
            "30 prières à l'heure accomplies ce mois"
          );
        }

        // Check for disciplined month (20+ days with all 5 prayers on time)
        let disciplinedDays = 0;
        for (const date of dates) {
          const isComplete = await checkDailyCompletion(date, false);
          if (isComplete) disciplinedDays++;
        }

        if (disciplinedDays >= 20) {
          await checkAndAwardBadge(
            "monthly_disciplined",
            "💪 Mois Discipliné",
            "Au moins 20 jours avec toutes les prières à l'heure"
          );
        }
      }
    } catch (error) {
      console.error("Error checking monthly badges:", error);
    }
  };

  const checkPeriodBadges = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check Douceur & Constante (3 spiritual acts today)
      const { data: todayActs } = await supabase
        .from("dhikr_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("prayer_date", today);

      if ((todayActs?.length || 0) >= 3) {
        await checkAndAwardBadge(
          "period_daily_3",
          "🌸 Douceur & Constante",
          "3 actes spirituels accomplis aujourd'hui"
        );
      }

      // Check Cycle serein (7 days in period with at least 1 act per day)
      const dates = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toISOString().split('T')[0]);
      }

      let allDaysHaveAct = true;
      for (const date of dates) {
        const { data } = await supabase
          .from("dhikr_tracking")
          .select("*")
          .eq("user_id", user.id)
          .eq("prayer_date", date);

        if (!data || data.length === 0) {
          allDaysHaveAct = false;
          break;
        }
      }

      if (allDaysHaveAct) {
        await checkAndAwardBadge(
          "period_cycle_serein",
          "🌙 Cycle Serein",
          "7 jours consécutifs avec au moins 1 acte spirituel"
        );
      }
    } catch (error) {
      console.error("Error checking period badges:", error);
    }
  };

  return {
    badges,
    checkDailyCompletion,
    checkWeeklyBadges,
    checkMonthlyBadges,
    checkPeriodBadges,
    checkAndAwardBadge,
  };
};
