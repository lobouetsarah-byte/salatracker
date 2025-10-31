import { useState, useEffect } from "react";

export interface NotificationSettings {
  prayerTimeReminders: boolean;
  missedPrayerReminders: boolean;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    prayerTimeReminders: true,
    missedPrayerReminders: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("notificationSettings");
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("notificationSettings", JSON.stringify(updated));
  };

  return { settings, updateSettings };
};
