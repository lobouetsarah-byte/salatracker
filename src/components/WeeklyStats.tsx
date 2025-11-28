import { useState } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, isSameMonth } from "date-fns";
import { fr } from "date-fns/locale";

interface WeeklyStatsProps {
  stats: {
    onTime: number;
    late: number;
    missed: number;
    total: number;
  };
  period: "daily" | "weekly" | "monthly";
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void;
  getCustomStats?: (startDate: Date, endDate: Date) => {
    onTime: number;
    late: number;
    missed: number;
    total: number;
  };
  externalSelectedDate?: Date;
}

export const WeeklyStats = ({ stats, period, onPeriodChange, getCustomStats, externalSelectedDate }: WeeklyStatsProps) => {
  const { t } = useLanguage();
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(new Date());
  const [compareMode, setCompareMode] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Use external date if provided, otherwise use internal
  const selectedDate = externalSelectedDate || internalSelectedDate;
  const setSelectedDate = externalSelectedDate ? () => {} : setInternalSelectedDate;

  const completionRate = stats.total > 0 
    ? Math.round(((stats.onTime + stats.late) / stats.total) * 100) 
    : 0;

  const successRate = stats.total > 0 
    ? Math.round((stats.onTime / stats.total) * 100) 
    : 0;

  // Get previous period stats for comparison
  const getPreviousStats = () => {
    if (!getCustomStats) return null;

    const currentDate = selectedDate;
    let previousStart: Date;
    let previousEnd: Date;

    if (period === "daily") {
      previousStart = new Date(currentDate);
      previousStart.setDate(currentDate.getDate() - 1);
      previousEnd = previousStart;
    } else if (period === "weekly") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      previousStart = new Date(weekStart);
      previousStart.setDate(weekStart.getDate() - 7);
      previousEnd = new Date(previousStart);
      previousEnd.setDate(previousStart.getDate() + 6);
    } else {
      previousStart = startOfMonth(subMonths(currentDate, 1));
      previousEnd = endOfMonth(subMonths(currentDate, 1));
    }

    return getCustomStats(previousStart, previousEnd);
  };

  const previousStats = compareMode ? getPreviousStats() : null;

  const getPeriodTitle = () => {
    if (period === "daily") return t.dailyProgress;
    if (period === "monthly") return t.monthlyProgress;
    return t.weeklyProgress;
  };

  const getPeriodDate = () => {
    if (period === "daily") {
      return format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr });
    }
    
    if (period === "weekly") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, "dd MMM", { locale: fr })} - ${format(weekEnd, "dd MMM yyyy", { locale: fr })}`;
    }
    
    if (period === "monthly") {
      return format(selectedDate, "MMMM yyyy", { locale: fr });
    }
  };

  const navigatePeriod = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    
    if (period === "daily") {
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (period === "weekly") {
      newDate.setDate(selectedDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setMonth(selectedDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    
    setSelectedDate(newDate);
  };

  const getDifference = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const diff = ((current - previous) / previous) * 100;
    return diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`;
  };

  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-card shadow-md">
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{getPeriodTitle()}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onPeriodChange("daily")}
              variant={period === "daily" ? "default" : "outline"}
              size="sm"
            >
              J
            </Button>
            <Button
              onClick={() => onPeriodChange("weekly")}
              variant={period === "weekly" ? "default" : "outline"}
              size="sm"
            >
              S
            </Button>
            <Button
              onClick={() => onPeriodChange("monthly")}
              variant={period === "monthly" ? "default" : "outline"}
              size="sm"
            >
              M
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigatePeriod("prev")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span className="text-sm">{getPeriodDate()}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setCalendarOpen(false);
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={() => navigatePeriod("next")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {period === "monthly" && (
          <Button
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
            className="w-full"
          >
            {compareMode ? "Cacher la comparaison" : "Comparer avec le mois précédent"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t.totalPrayers}</div>
          {compareMode && previousStats && (
            <div className="text-xs text-primary mt-1 font-semibold">
              {getDifference(stats.total, previousStats.total)}
            </div>
          )}
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <div className="text-2xl sm:text-3xl font-bold text-success">{stats.onTime}</div>
          </div>
          <div className="text-xs sm:text-sm text-success font-medium">{t.onTime}</div>
          <div className="text-xs text-success/70 mt-1">{successRate}%</div>
          {compareMode && previousStats && (
            <div className="text-xs text-primary mt-1 font-semibold">
              {getDifference(stats.onTime, previousStats.onTime)}
            </div>
          )}
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle className="w-4 h-4 text-warning" />
            <div className="text-2xl sm:text-3xl font-bold text-warning">{stats.late}</div>
          </div>
          <div className="text-xs sm:text-sm text-warning font-medium">{t.late}</div>
          {compareMode && previousStats && (
            <div className="text-xs text-primary mt-1 font-semibold">
              {getDifference(stats.late, previousStats.late)}
            </div>
          )}
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-destructive" />
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.missed}</div>
          </div>
          <div className="text-xs sm:text-sm text-destructive font-medium">{t.missed}</div>
          {compareMode && previousStats && (
            <div className="text-xs text-primary mt-1 font-semibold">
              {getDifference(stats.missed, previousStats.missed)}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="relative w-full h-6 sm:h-8 bg-muted rounded-full overflow-hidden shadow-inner">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-success via-success to-primary transition-all duration-700 ease-out flex items-center justify-center text-white text-xs sm:text-sm font-semibold shadow-md"
            style={{ width: `${completionRate}%` }}
          >
            {completionRate > 15 && `${completionRate}%`}
          </div>
        </div>
        <p className="text-center text-xs sm:text-sm text-muted-foreground">
          {t.completionRate}: <span className="font-semibold text-foreground">{completionRate}%</span>
        </p>
      </div>
    </Card>
  );
};