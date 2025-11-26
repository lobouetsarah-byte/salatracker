import { useState, useEffect } from 'react';
import { getHadithOfTheDay } from '@/data/hadiths';

interface DailyHadithResult {
  hadith: {
    arabic_text: string;
    french_translation: string;
    reference: string;
  } | null;
  loading: boolean;
  error: string | null;
}

export const useDailyHadith = (): DailyHadithResult => {
  const [hadith, setHadith] = useState<{
    arabic_text: string;
    french_translation: string;
    reference: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      const todaysHadith = getHadithOfTheDay();

      setHadith({
        arabic_text: todaysHadith.arabic,
        french_translation: todaysHadith.french,
        reference: todaysHadith.reference,
      });

      setError(null);
    } catch (err) {
      console.error('Error loading hadith:', err);
      setError("Le hadith du jour n'est pas disponible pour le moment.");
      setHadith(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { hadith, loading, error };
};
