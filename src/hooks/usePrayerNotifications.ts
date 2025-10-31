import { useEffect, useRef } from "react";
import { Prayer } from "./usePrayerTimes";
import { PrayerStatus } from "./usePrayerTracking";
import { NotificationSettings } from "./useSettings";

export const usePrayerNotifications = (
  prayers: Prayer[],
  getPrayerStatus: (date: string, prayerName: string) => PrayerStatus,
  settings: NotificationSettings
) => {
  const intervalRef = useRef<number | null>(null);
  const notifiedPrayersRef = useRef<Set<string>>(new Set());

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const sendNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/placeholder.svg",
        badge: "/placeholder.svg",
      });
    }
  };

  const checkPrayerReminders = () => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    prayers.forEach((prayer, index) => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerDate = new Date(now);
      prayerDate.setHours(hours, minutes, 0, 0);

      const timeDiff = prayerDate.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      // Prayer time notification (within 1 minute window)
      if (settings.prayerTimeReminders && minutesDiff >= 0 && minutesDiff <= 1) {
        const notificationKey = `${today}-${prayer.name}-time`;
        if (!notifiedPrayersRef.current.has(notificationKey)) {
          sendNotification(
            `🕌 Prayer Time`,
            `It's time for ${prayer.name} prayer`
          );
          notifiedPrayersRef.current.add(notificationKey);
        }
      }

      // Missed prayer reminder (30 min before next prayer)
      if (settings.missedPrayerReminders) {
        const nextPrayer = prayers[index + 1];
        if (nextPrayer) {
          const [nextHours, nextMinutes] = nextPrayer.time.split(":").map(Number);
          const nextPrayerDate = new Date(now);
          nextPrayerDate.setHours(nextHours, nextMinutes, 0, 0);
          
          const thirtyMinBefore = new Date(nextPrayerDate.getTime() - 30 * 60 * 1000);
          const status = getPrayerStatus(today, prayer.name);
          
          if (now >= thirtyMinBefore && status === "pending") {
            const notificationKey = `${today}-${prayer.name}-missed`;
            if (!notifiedPrayersRef.current.has(notificationKey)) {
              sendNotification(
                `⏰ Prayer Reminder`,
                `You haven't marked ${prayer.name} prayer yet. ${nextPrayer.name} starts in 30 minutes!`
              );
              notifiedPrayersRef.current.add(notificationKey);
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    requestNotificationPermission();

    if (prayers.length > 0) {
      intervalRef.current = window.setInterval(checkPrayerReminders, 60000);
      checkPrayerReminders();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [prayers]);
};
