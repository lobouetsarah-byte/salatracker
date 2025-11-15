import { Card } from "@/components/ui/card";
import { Heart, Sparkles, BookHeart, Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePeriodDhikrTracking, DhikrType } from "@/hooks/usePeriodDhikrTracking";
import { usePeriodMode } from "@/hooks/usePeriodMode";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export const PeriodStats = () => {
  const { user } = useAuth();
  const { getDhikrForPrayer } = usePeriodDhikrTracking();
  const { isInPeriod } = usePeriodMode();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState<"start" | "end" | null>(null);
  const [stats, setStats] = useState({
    dhikr: 0,
    invocation: 0,
    remembrance: 0,
    total: 0,
  });

  useEffect(() => {
    const loadPeriodStats = async () => {
      if (!user || !isInPeriod) return;

      try {
        // Get current active period if no custom dates
        if (!startDate) {
          const { data: periodData } = await supabase
            .from("period_tracking")
            .select("*")
            .eq("user_id", user.id)
            .eq("is_active", true)
            .maybeSingle();

          if (periodData) {
            setStartDate(new Date(periodData.start_date));
            setEndDate(periodData.end_date ? new Date(periodData.end_date) : new Date());
          }
        }

        const start = startDate?.toISOString().split("T")[0];
        const end = endDate?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0];

        if (!start) return;

        // Get all dhikr entries for the selected period
        const { data: dhikrData } = await supabase
          .from("dhikr_tracking")
          .select("*")
          .eq("user_id", user.id)
          .gte("prayer_date", start)
          .lte("prayer_date", end);

        if (!dhikrData) return;

        // Count by type (we'll use completed field and count all as dhikr for now)
        const dhikrCount = dhikrData.filter(d => d.completed).length;

        setStats({
          dhikr: dhikrCount,
          invocation: 0,
          remembrance: 0,
          total: dhikrCount,
        });
      } catch (error) {
        console.error("Error loading period stats:", error);
      }
    };

    loadPeriodStats();
  }, [user, isInPeriod, startDate, endDate]);

  if (!isInPeriod) return null;

  const completionRate = stats.total > 0 ? 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-[hsl(var(--period-card))] to-[hsl(var(--period-accent))] border-[hsl(var(--period-border))]">
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[hsl(var(--period-button))] shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[hsl(var(--period-text))]">Statistiques Indisposée</h2>
            <p className="text-sm text-[hsl(var(--period-text))]/70">Votre parcours spirituel</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Popover open={datePickerOpen === "start"} onOpenChange={(open) => setDatePickerOpen(open ? "start" : null)}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/80 border-[hsl(var(--period-border))]">
                <CalendarIcon className="w-4 h-4 mr-2 text-[hsl(var(--period-button))]" />
                <span className="text-xs text-[hsl(var(--period-text))]">
                  {startDate ? format(startDate, "dd MMM", { locale: fr }) : "Début"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  setStartDate(date);
                  setDatePickerOpen(null);
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <span className="text-[hsl(var(--period-text))]/70">→</span>

          <Popover open={datePickerOpen === "end"} onOpenChange={(open) => setDatePickerOpen(open ? "end" : null)}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/80 border-[hsl(var(--period-border))]">
                <CalendarIcon className="w-4 h-4 mr-2 text-[hsl(var(--period-button))]" />
                <span className="text-xs text-[hsl(var(--period-text))]">
                  {endDate ? format(endDate, "dd MMM", { locale: fr }) : "Fin"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => {
                  setEndDate(date);
                  setDatePickerOpen(null);
                }}
                disabled={(date) => date > new Date() || (startDate && date < startDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[hsl(var(--period-border))]">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-[hsl(var(--period-button))]" />
            <span className="text-sm font-medium text-[hsl(var(--period-text))]/70">Dhikr</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--period-text))]">{stats.dhikr}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[hsl(var(--period-border))]">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[hsl(var(--period-button))]" />
            <span className="text-sm font-medium text-[hsl(var(--period-text))]/70">Invocations</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--period-text))]">{stats.invocation}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[hsl(var(--period-border))]">
          <div className="flex items-center gap-2 mb-2">
            <BookHeart className="w-4 h-4 text-[hsl(var(--period-button))]" />
            <span className="text-sm font-medium text-[hsl(var(--period-text))]/70">Rappels</span>
          </div>
          <p className="text-3xl font-bold text-[hsl(var(--period-text))]">{stats.remembrance}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-[hsl(var(--period-text))]">Total des pratiques</span>
          <span className="font-bold text-[hsl(var(--period-text))]">{stats.total}</span>
        </div>

        <div className="relative h-3 bg-white/50 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[hsl(var(--period-button))] to-[hsl(var(--period-button-hover))] transition-all duration-500 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="text-xs text-center text-[hsl(var(--period-text))]/70">
          Continuez vos pratiques spirituelles pendant cette période 🌸
        </p>
      </div>
    </Card>
  );
};
