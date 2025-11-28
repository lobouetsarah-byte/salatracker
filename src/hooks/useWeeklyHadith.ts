import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Hadith {
  id: string;
  title: string;
  arabic_text: string;
  french_translation: string;
  reference: string;
  week_number: number | null;
}

export const useWeeklyHadith = () => {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWeeklyHadith = async () => {
      try {
        // Get current week number (1-52)
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const daysSinceStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        const currentWeek = Math.ceil((daysSinceStart + startOfYear.getDay() + 1) / 7);

        const { data, error } = await supabase
          .from("hadiths")
          .select("*")
          .eq("is_published", true)
          .eq("week_number", currentWeek)
          .maybeSingle();

        if (error) {
          // Check for schema cache error (PGRST205)
          if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
            console.error("Table 'hadiths' non trouvée dans le schéma Supabase:", error);
            toast({
              title: "Erreur de configuration",
              description: "Une erreur de configuration du serveur s'est produite. Merci de réessayer plus tard.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          throw error;
        }

        if (data) {
          setHadith(data);
        } else {
          // Fallback: get any published hadith if no hadith for current week
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("hadiths")
            .select("*")
            .eq("is_published", true)
            .limit(1)
            .maybeSingle();

          if (fallbackError) {
            if (fallbackError.code === 'PGRST205' || fallbackError.message?.includes('schema cache')) {
              console.error("Table 'hadiths' non trouvée:", fallbackError);
              setLoading(false);
              return;
            }
            throw fallbackError;
          }
          setHadith(fallbackData);
        }
      } catch (error: any) {
        console.error("Erreur lors du chargement du hadith:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le hadith de la semaine",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadWeeklyHadith();
  }, [toast]);

  return { hadith, loading };
};
