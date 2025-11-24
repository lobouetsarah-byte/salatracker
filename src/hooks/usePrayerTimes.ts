import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { LocationSettings } from "./useLocationSettings";
import { locationService } from "@/services/LocationService";

export interface Prayer {
  name: string;
  time: string;
  arabicName: string;
}

interface PrayerTimesData {
  prayers: Prayer[];
  date: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const CACHE_KEY = "cached_prayer_times";
const CACHE_DATE_KEY = "cached_prayer_date";

interface UsePrayerTimesProps {
  locationSettings?: LocationSettings;
}

export const usePrayerTimes = ({ locationSettings }: UsePrayerTimesProps = {}) => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState<string>("Fetching location...");
  const { toast } = useToast();

  // Load cached prayer times
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    const today = new Date().toDateString();

    if (cached && cachedDate === today) {
      try {
        setPrayerTimes(JSON.parse(cached));
      } catch (error) {
        console.error("Failed to parse cached prayer times:", error);
      }
    }
  }, []);

  const fetchPrayerTimesByCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      setLoading(true);
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      
      const data = await response.json();
      
      if (data.code === 200) {
        const timings = data.data.timings;
        const prayers: Prayer[] = [
          { name: "Fajr", time: timings.Fajr, arabicName: "الفجر" },
          { name: "Dhuhr", time: timings.Dhuhr, arabicName: "الظهر" },
          { name: "Asr", time: timings.Asr, arabicName: "العصر" },
          { name: "Maghrib", time: timings.Maghrib, arabicName: "المغرب" },
          { name: "Isha", time: timings.Isha, arabicName: "العشاء" },
        ];

        const prayerData: PrayerTimesData = {
          prayers,
          date: data.data.date.readable,
          location: data.data.meta.timezone || "Your Location",
          coordinates: { latitude, longitude },
        };

        setPrayerTimes(prayerData);
        setLocationName(data.data.meta.timezone || "Your Location");
        
        // Cache the prayer times
        localStorage.setItem(CACHE_KEY, JSON.stringify(prayerData));
        localStorage.setItem(CACHE_DATE_KEY, date.toDateString());
      }
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      toast({
        title: "Error",
        description: "Failed to fetch prayer times. Using cached data if available.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPrayerTimesByCity = useCallback(async (city: string, country: string) => {
    try {
      setLoading(true);
      const date = new Date();
      const timestamp = Math.floor(date.getTime() / 1000);
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${timestamp}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`
      );
      
      const data = await response.json();
      
      if (data.code === 200) {
        const timings = data.data.timings;
        const prayers: Prayer[] = [
          { name: "Fajr", time: timings.Fajr, arabicName: "الفجر" },
          { name: "Dhuhr", time: timings.Dhuhr, arabicName: "الظهر" },
          { name: "Asr", time: timings.Asr, arabicName: "العصر" },
          { name: "Maghrib", time: timings.Maghrib, arabicName: "المغرب" },
          { name: "Isha", time: timings.Isha, arabicName: "العشاء" },
        ];

        const prayerData: PrayerTimesData = {
          prayers,
          date: data.data.date.readable,
          location: `${city}, ${country}`,
          coordinates: {
            latitude: data.data.meta.latitude,
            longitude: data.data.meta.longitude,
          },
        };

        setPrayerTimes(prayerData);
        setLocationName(`${city}, ${country}`);
        
        // Cache the prayer times
        localStorage.setItem(CACHE_KEY, JSON.stringify(prayerData));
        localStorage.setItem(CACHE_DATE_KEY, date.toDateString());
      }
    } catch (error) {
      console.error("Failed to fetch prayer times:", error);
      toast({
        title: "Error",
        description: "Failed to fetch prayer times for this city.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch prayer times based on location settings
  useEffect(() => {
    const fetchPrayerTimes = async () => {
      if (locationSettings?.mode === "manual" && locationSettings.manualLocation) {
        const { city, country, latitude, longitude } = locationSettings.manualLocation;
        
        if (city && country) {
          await fetchPrayerTimesByCity(city, country);
        } else if (latitude !== undefined && longitude !== undefined) {
          await fetchPrayerTimesByCoordinates(latitude, longitude);
        }
      } else {
        // Auto mode - use LocationService for single permission request
        const position = await locationService.getCurrentPosition();

        if (position) {
          await fetchPrayerTimesByCoordinates(position.lat, position.lng);
        } else {
          // Fallback to Mecca if location denied or unavailable
          await fetchPrayerTimesByCoordinates(21.4225, 39.8262);
          toast({
            title: "Accès à la localisation",
            description: "Utilisation de la localisation par défaut. Autorisez l'accès à la localisation pour des horaires précis.",
          });
        }
      }
    };

    fetchPrayerTimes();
  }, [locationSettings, fetchPrayerTimesByCoordinates, fetchPrayerTimesByCity, toast]);

  // Check for day change and refresh prayer times
  useEffect(() => {
    const checkDayChange = () => {
      const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
      const today = new Date().toDateString();
      
      if (cachedDate && cachedDate !== today) {
        // Day has changed, refetch prayer times
        window.location.reload();
      }
    };

    // Check every minute
    const interval = setInterval(checkDayChange, 60000);

    return () => clearInterval(interval);
  }, []);

  return { 
    prayerTimes, 
    loading, 
    locationName,
    isManualMode: locationSettings?.mode === "manual",
  };
};
