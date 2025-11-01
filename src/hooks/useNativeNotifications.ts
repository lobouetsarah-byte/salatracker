import { useEffect } from "react";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { Prayer } from "./usePrayerTimes";
import { PrayerStatus } from "./usePrayerTracking";
import { NotificationSettings } from "./useSettings";

export const useNativeNotifications = (
  prayers: Prayer[],
  getPrayerStatus: (date: string, prayerName: string) => PrayerStatus,
  settings: NotificationSettings
) => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;

    const setupNotifications = async () => {
      // Request permissions
      const permission = await LocalNotifications.requestPermissions();
      if (permission.display !== 'granted') return;

      // Schedule prayer time notifications
      if (settings.prayerTimeReminders) {
        const notifications = prayers.map((prayer, index) => {
          const [hours, minutes] = prayer.time.split(":").map(Number);
          const prayerDate = new Date();
          prayerDate.setHours(hours, minutes, 0, 0);

          return {
            id: index + 1,
            title: `🕌 ${prayer.name}`,
            body: `C'est l'heure de la prière ${prayer.name}`,
            schedule: {
              at: prayerDate,
              allowWhileIdle: true,
            },
            sound: "adhan.mp3",
            attachments: undefined,
            actionTypeId: "",
            extra: null,
          };
        });

        await LocalNotifications.schedule({ notifications });
      }

      // Schedule missed prayer reminders (30 min before next prayer)
      if (settings.missedPrayerReminders) {
        const reminders = prayers.slice(0, -1).map((prayer, index) => {
          const nextPrayer = prayers[index + 1];
          const [nextHours, nextMinutes] = nextPrayer.time.split(":").map(Number);
          const reminderDate = new Date();
          reminderDate.setHours(nextHours, nextMinutes - 30, 0, 0);

          const today = new Date().toISOString().split("T")[0];
          const status = getPrayerStatus(today, prayer.name);

          if (status === "pending") {
            return {
              id: prayers.length + index + 1,
              title: `⏰ Rappel`,
              body: `Vous n'avez pas marqué la prière ${prayer.name}. ${nextPrayer.name} commence dans 30 minutes !`,
              schedule: {
                at: reminderDate,
                allowWhileIdle: true,
              },
              sound: undefined,
              attachments: undefined,
              actionTypeId: "",
              extra: null,
            };
          }
          return null;
        }).filter(Boolean);

        if (reminders.length > 0) {
          await LocalNotifications.schedule({ notifications: reminders as any[] });
        }
      }
    };

    setupNotifications();

    return () => {
      if (isNative) {
        LocalNotifications.getPending().then((result) => {
          const ids = result.notifications.map((n) => n.id);
          if (ids.length > 0) {
            LocalNotifications.cancel({ notifications: result.notifications });
          }
        });
      }
    };
  }, [prayers, settings, isNative, getPrayerStatus]);
};
