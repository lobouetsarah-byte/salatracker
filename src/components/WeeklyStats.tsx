import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from "lucide-react";

interface WeeklyStatsProps {
  stats: {
    onTime: number;
    late: number;
    missed: number;
    total: number;
  };
}

export const WeeklyStats = ({ stats }: WeeklyStatsProps) => {
  const completionRate = stats.total > 0 
    ? Math.round(((stats.onTime + stats.late) / stats.total) * 100) 
    : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">This Week's Progress</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 rounded-lg bg-card">
          <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Prayers</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-success/10 border border-success/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <div className="text-3xl font-bold text-success">{stats.onTime}</div>
          </div>
          <div className="text-sm text-success">On Time</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <AlertCircle className="w-4 h-4 text-warning" />
            <div className="text-3xl font-bold text-warning">{stats.late}</div>
          </div>
          <div className="text-sm text-warning">Late</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="flex items-center justify-center gap-1 mb-1">
            <XCircle className="w-4 h-4 text-destructive" />
            <div className="text-3xl font-bold text-destructive">{stats.missed}</div>
          </div>
          <div className="text-sm text-destructive">Missed</div>
        </div>
      </div>

      <div className="relative w-full h-8 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-success to-primary transition-all duration-500 flex items-center justify-center text-white text-sm font-semibold"
          style={{ width: `${completionRate}%` }}
        >
          {completionRate > 10 && `${completionRate}%`}
        </div>
      </div>
      <p className="text-center mt-2 text-sm text-muted-foreground">
        Completion Rate: {completionRate}%
      </p>
    </Card>
  );
};
