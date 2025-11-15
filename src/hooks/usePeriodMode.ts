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

  // Apply/remove global theme class for period mode
  useEffect(() => {
    const root = document.documentElement;
    if (isInPeriod) root.classList.add('period-mode');
    else root.classList.remove('period-mode');
  }, [isInPeriod]);

  // Listen to cross-component/tab period-mode changes
  useEffect(() => {
    const handler = (e: any) => {
      const status = e.detail?.isInPeriod;
      if (typeof status === 'boolean') setIsInPeriod(status);
    };
    window.addEventListener('period-mode-changed', handler as EventListener);

    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'periodMode' && ev.newValue) {
        setIsInPeriod(ev.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('period-mode-changed', handler as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

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
    const newStatus = !isInPeriod;

    // Optimistic UI update for instant feedback
    setIsInPeriod(newStatus);
    localStorage.setItem("periodMode", newStatus.toString());

    try {
      // Broadcast to other components/tabs
      window.dispatchEvent(new CustomEvent("period-mode-changed", { detail: { isInPeriod: newStatus } }));
    } catch {}

    // Apply global theme class immediately
    try {
      const root = document.documentElement;
      if (newStatus) root.classList.add("period-mode");
      else root.classList.remove("period-mode");
    } catch {}

    if (user) {
      try {
        if (!newStatus && currentPeriodId) {
          // End current period
          const { error } = await supabase
            .from("period_tracking")
            .update({
              is_active: false,
              end_date: new Date().toISOString().split('T')[0],
            })
            .eq("id", currentPeriodId);

          if (error) throw error;

          setCurrentPeriodId(null);
          toast({
            title: "Bienvenue de retour ✨",
            description: "Le mode indisposée est désactivé. Tu peux reprendre le suivi de tes prières normalement.",
          });
        } else if (newStatus) {
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

          setCurrentPeriodId(data.id);
          toast({
            title: "Mode indisposée activé",
            description: "Suivez vos dhikr et invocations pendant cette période.",
          });
        } else {
          // Deactivation without currentPeriodId, reload to be safe
          await loadPeriodStatus();
        }
      } catch (error: any) {
        // Revert on error
        const revert = !newStatus;
        setIsInPeriod(revert);
        localStorage.setItem("periodMode", revert.toString());
        try {
          window.dispatchEvent(new CustomEvent("period-mode-changed", { detail: { isInPeriod: revert } }));
        } catch {}
        const root = document.documentElement;
        if (revert) root.classList.add("period-mode"); else root.classList.remove("period-mode");

        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Fallback to local only (not authenticated)
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
