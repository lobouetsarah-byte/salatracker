import { useEffect } from "react";
import { toast } from "sonner";
import type { Prayer } from "./usePrayerTimes";
import { NotificationSettings } from "./useSettings";

interface PeriodNotificationHookProps {
  prayers: Prayer[];
  isInPeriod: boolean;
  settings: NotificationSettings;
}

export const usePeriodNotifications = ({ 
  prayers, 
  isInPeriod, 
  settings 
}: PeriodNotificationHookProps) => {
  useEffect(() => {
    // Only set up notifications if in period mode and prayer time reminders are enabled
    if (!isInPeriod || !settings.prayerTimeReminders || prayers.length === 0) {
      return;
    }

    const checkPrayerTime = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      prayers.forEach((prayer) => {
        if (prayer.time === currentTime) {
          // Show period-specific notification
          toast.info(
            `C'est l'heure de ${prayer.name}. Prenez 5 minutes pour faire du dhikr et nourrir votre foi 🌸`,
            {
              duration: 10000,
              icon: "🕌",
            }
          );

          // Try to show native notification if available
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`${prayer.name} - Moment spirituel`, {
              body: `C'est l'heure de ${prayer.name}. Prenez 5 minutes pour faire du dhikr et nourrir votre foi 🌸`,
              icon: "/icon-512.png",
              badge: "/icon-512.png",
            });
          }
        }
      });
    };

    // Check immediately
    checkPrayerTime();

    // Then check every minute
    const interval = setInterval(checkPrayerTime, 60000);

    return () => clearInterval(interval);
  }, [prayers, isInPeriod, settings.prayerTimeReminders]);
};
