import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const usePeriodMode = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInPeriod, setIsInPeriod] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPeriodId, setCurrentPeriodId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPeriodStatus();
    } else {
      // Load from localStorage if not authenticated
      const stored = localStorage.getItem("periodMode");
      if (stored) {
        setIsInPeriod(stored === "true");
      }
      setLoading(false);
    }
  }, [user]);

  const loadPeriodStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("period_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsInPeriod(true);
        setCurrentPeriodId(data.id);
      } else {
        setIsInPeriod(false);
        setCurrentPeriodId(null);
      }
    } catch (error) {
      console.error("Error loading period status:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePeriodMode = async () => {
    if (user) {
      try {
        if (isInPeriod && currentPeriodId) {
          // End current period
          const { error } = await supabase
            .from("period_tracking")
            .update({
              is_active: false,
              end_date: new Date().toISOString().split('T')[0],
            })
            .eq("id", currentPeriodId);

          if (error) throw error;

          setIsInPeriod(false);
          setCurrentPeriodId(null);
          
          toast({
            title: "Bienvenue de retour ✨",
            description: "Le mode indisposée est désactivé. Tu peux reprendre le suivi de tes prières normalement.",
          });
        } else {
          // Start new period
          const { data, error } = await supabase
            .from("period_tracking")
            .insert({
              user_id: user.id,
              start_date: new Date().toISOString().split('T')[0],
              is_active: true,
            })
            .select()
            .single();

          if (error) throw error;

          setIsInPeriod(true);
          setCurrentPeriodId(data.id);
          
          toast({
            title: "Mode indisposée activé",
            description: "Suivez vos dhikr et invocations pendant cette période.",
          });
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Fallback to localStorage
      const newStatus = !isInPeriod;
      setIsInPeriod(newStatus);
      localStorage.setItem("periodMode", newStatus.toString());
      
      toast({
        title: newStatus ? "Mode indisposée activé" : "Bienvenue de retour ✨",
        description: newStatus 
          ? "Suivez vos dhikr et invocations pendant cette période."
          : "Le mode indisposée est désactivé. Tu peux reprendre le suivi de tes prières normalement.",
      });
    }
  };

  return {
    isInPeriod,
    loading,
    togglePeriodMode,
  };
};
