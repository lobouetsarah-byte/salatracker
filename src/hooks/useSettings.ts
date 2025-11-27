import { useState, useEffect } from "react";

export interface NotificationSettings {
  notificationsEnabled: boolean; // Single toggle for all notifications
}

export const useSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    notificationsEnabled: true,
  });

  useEffect(() => {
    // Check localStorage for the new simplified setting
    const enabled = localStorage.getItem("notifications_enabled");
    if (enabled !== null) {
      setSettings({ notificationsEnabled: enabled === 'true' });
    } else {
      // Migrate from old settings if they exist
      const oldStored = localStorage.getItem("notificationSettings");
      if (oldStored) {
        try {
          const oldSettings = JSON.parse(oldStored);
          const wasEnabled = oldSettings.prayerTimeReminders || false;
          setSettings({ notificationsEnabled: wasEnabled });
          localStorage.setItem("notifications_enabled", wasEnabled.toString());
        } catch (e) {
          console.error('Failed to migrate old settings:', e);
        }
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    // Save to localStorage using the same key the service uses
    if (newSettings.notificationsEnabled !== undefined) {
      localStorage.setItem("notifications_enabled", newSettings.notificationsEnabled.toString());
    }
  };

  return { settings, updateSettings };
};
