import { useState, useEffect } from "react";

export interface LocationSettings {
  mode: "auto" | "manual";
  manualLocation?: {
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
}

const STORAGE_KEY = "prayer_location_settings";

export const useLocationSettings = () => {
  const [settings, setSettings] = useState<LocationSettings>({
    mode: "auto",
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse location settings:", error);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<LocationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const setAutoMode = () => {
    updateSettings({ mode: "auto", manualLocation: undefined });
  };

  const setManualMode = (location: LocationSettings["manualLocation"]) => {
    updateSettings({ mode: "manual", manualLocation: location });
  };

  return {
    settings,
    updateSettings,
    setAutoMode,
    setManualMode,
    isManualMode: settings.mode === "manual",
  };
};
