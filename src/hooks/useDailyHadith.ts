import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Hadith {
  id: string;
  title: string;
  arabic_text: string;
  french_translation: string;
  reference: string;
}

const STORAGE_KEY = "daily_hadith";
const DATE_KEY = "daily_hadith_date";

export const useDailyHadith = () => {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDailyHadith = async () => {
      try {
        const today = new Date().toDateString();
        const storedDate = localStorage.getItem(DATE_KEY);
        const storedHadith = localStorage.getItem(STORAGE_KEY);

        if (storedDate === today && storedHadith) {
          setHadith(JSON.parse(storedHadith));
          setLoading(false);
          return;
        }

        const dayOfYear = Math.floor(
          (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
            (1000 * 60 * 60 * 24)
        );

        const { data: hadiths, error: fetchError } = await supabase
          .from("hadiths")
          .select("id, title, arabic_text, french_translation, reference")
          .eq("is_published", true);

        if (fetchError) throw fetchError;

        if (!hadiths || hadiths.length === 0) {
          setError("Le hadith du jour n'est pas disponible pour le moment.");
          setLoading(false);
          return;
        }

        const todayHadith = hadiths[dayOfYear % hadiths.length];

        setHadith(todayHadith);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todayHadith));
        localStorage.setItem(DATE_KEY, today);
      } catch (err: any) {
        console.error("Error loading daily hadith:", err);
        setError("Le hadith du jour n'est pas disponible pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    loadDailyHadith();
  }, []);

  return { hadith, loading, error };
};
