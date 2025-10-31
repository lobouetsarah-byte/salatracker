import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Prayer {
  name: string;
  time: string;
  arabicName: string;
}

interface PrayerTimesData {
  prayers: Prayer[];
  date: string;
  location: string;
}

export const usePrayerTimes = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      const date = new Date();
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${date.getTime() / 1000}?latitude=${latitude}&longitude=${longitude}&method=2`
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

        setPrayerTimes({
          prayers,
          date: data.data.date.readable,
          location: data.data.meta.timezone || "Your Location",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch prayer times. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Fallback to Mecca if location denied
          fetchPrayerTimes(21.4225, 39.8262);
          toast({
            title: "Location Access",
            description: "Using default location. Grant location access for accurate prayer times.",
          });
        }
      );
    } else {
      // Fallback to Mecca
      fetchPrayerTimes(21.4225, 39.8262);
    }
  }, []);

  return { prayerTimes, loading };
};
