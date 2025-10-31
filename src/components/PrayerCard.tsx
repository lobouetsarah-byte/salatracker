import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerCardProps {
  name: string;
  time: string;
  isNext: boolean;
  status: "pending" | "on-time" | "late" | "missed";
  onStatusChange: (status: "on-time" | "late" | "missed") => void;
}

export const PrayerCard = ({ name, time, isNext, status, onStatusChange }: PrayerCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "on-time":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "late":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "missed":
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-success text-success-foreground">On Time</Badge>;
      case "late":
        return <Badge className="bg-warning text-warning-foreground">Late</Badge>;
      case "missed":
        return <Badge className="bg-destructive text-destructive-foreground">Missed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "p-6 transition-all duration-300 hover:shadow-lg",
        isNext && "border-primary border-2 shadow-md bg-primary/5"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <p className="text-2xl font-bold text-primary">{time}</p>
          </div>
        </div>
        {isNext && (
          <Badge variant="outline" className="border-primary text-primary">
            Next Prayer
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {status !== "pending" && (
          <div className="mb-2">{getStatusBadge()}</div>
        )}
        <p className="text-sm text-muted-foreground mb-2">
          {status === "pending" ? "Mark as:" : "Change to:"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onStatusChange("on-time")}
            disabled={status === "on-time"}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg border transition-colors text-sm font-medium",
              status === "on-time"
                ? "border-success bg-success/20 text-success cursor-not-allowed opacity-60"
                : "border-success/30 bg-success/10 text-success hover:bg-success/20"
            )}
          >
            On Time
          </button>
          <button
            onClick={() => onStatusChange("late")}
            disabled={status === "late"}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg border transition-colors text-sm font-medium",
              status === "late"
                ? "border-warning bg-warning/20 text-warning cursor-not-allowed opacity-60"
                : "border-warning/30 bg-warning/10 text-warning hover:bg-warning/20"
            )}
          >
            Late
          </button>
          <button
            onClick={() => onStatusChange("missed")}
            disabled={status === "missed"}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg border transition-colors text-sm font-medium",
              status === "missed"
                ? "border-destructive bg-destructive/20 text-destructive cursor-not-allowed opacity-60"
                : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
            )}
          >
            Missed
          </button>
        </div>
      </div>
    </Card>
  );
};
