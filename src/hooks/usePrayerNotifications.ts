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
  const adhanAudioRef = useRef<HTMLAudioElement | null>(null);

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const playAdhan = () => {
    // Using a free adhan audio URL
    if (!adhanAudioRef.current) {
      adhanAudioRef.current = new Audio("https://www.islamcan.com/audio/adhan/adhan-makkah.mp3");
    }
    adhanAudioRef.current.play().catch((error) => {
      console.log("Could not play adhan:", error);
    });
  };

  const sendNotification = (title: string, body: string, playSound: boolean = false) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(title, {
        body,
        icon: "/favicon.png",
        badge: "/favicon.png",
        tag: title,
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      if (playSound) {
        playAdhan();
      }
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

      // Prayer time notification (within 1 minute window) - play adhan
      if (settings.prayerTimeReminders && minutesDiff >= 0 && minutesDiff <= 1) {
        const notificationKey = `${today}-${prayer.name}-time`;
        if (!notifiedPrayersRef.current.has(notificationKey)) {
          sendNotification(
            `🕌 ${prayer.name}`,
            `C'est l'heure de la prière ${prayer.name}`,
            true
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
                `⏰ Rappel`,
                `Vous n'avez pas marqué la prière ${prayer.name}. ${nextPrayer.name} commence dans 30 minutes !`,
                false
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
      if (adhanAudioRef.current) {
        adhanAudioRef.current.pause();
        adhanAudioRef.current = null;
      }
    };
  }, [prayers, settings]);
};
