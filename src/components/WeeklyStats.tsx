import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface WeeklyStatsProps {
  stats: {
    onTime: number;
    late: number;
    missed: number;
    total: number;
  };
  period: "daily" | "weekly" | "monthly";
  onPeriodChange: (period: "daily" | "weekly" | "monthly") => void;
}

export const WeeklyStats = ({ stats, period, onPeriodChange }: WeeklyStatsProps) => {
  const { t } = useLanguage();
  const completionRate = stats.total > 0 
    ? Math.round(((stats.onTime + stats.late) / stats.total) * 100) 
    : 0;

  const successRate = stats.total > 0 
    ? Math.round((stats.onTime / stats.total) * 100) 
    : 0;

  const getPeriodTitle = () => {
    if (period === "daily") return t.dailyProgress;
    if (period === "monthly") return t.monthlyProgress;
    return t.weeklyProgress;
  };

  return (
    <Card className="p-4 sm:p-6 bg-white dark:bg-card shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{getPeriodTitle()}</h2>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onPeriodChange("daily")}
            variant={period === "daily" ? "default" : "outline"}
            size="sm"
            className="transition-all"
          >
            J
          </Button>
          <Button
            onClick={() => onPeriodChange("weekly")}
            variant={period === "weekly" ? "default" : "outline"}
            size="sm"
            className="transition-all"
          >
            S
          </Button>
          <Button
            onClick={() => onPeriodChange("monthly")}
            variant={period === "monthly" ? "default" : "outline"}
            size="sm"
            className="transition-all"
          >
            M
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs sm:text-sm text-muted-foreground mt-1">{t.totalPrayers}</div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-success/10 to-success/5 border border-success/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <div className="text-2xl sm:text-3xl font-bold text-success">{stats.onTime}</div>
          </div>
          <div className="text-xs sm:text-sm text-success font-medium">{t.onTime}</div>
          <div className="text-xs text-success/70 mt-1">{successRate}%</div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle className="w-4 h-4 text-warning" />
            <div className="text-2xl sm:text-3xl font-bold text-warning">{stats.late}</div>
          </div>
          <div className="text-xs sm:text-sm text-warning font-medium">{t.late}</div>
        </div>
        <div className="text-center p-3 sm:p-4 rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-destructive" />
            <div className="text-2xl sm:text-3xl font-bold text-destructive">{stats.missed}</div>
          </div>
          <div className="text-xs sm:text-sm text-destructive font-medium">{t.missed}</div>
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
