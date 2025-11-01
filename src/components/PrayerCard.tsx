import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Trash2 } from "lucide-react";
import { PrayerStatus } from "@/hooks/usePrayerTracking";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PrayerCardProps {
  name: string;
  time: string;
  isNext: boolean;
  isPast: boolean;
  status: PrayerStatus;
  dhikrDone: boolean;
  onStatusChange: (status: PrayerStatus) => void;
  onStatusDelete: () => void;
  onDhikrToggle: () => void;
}

export const PrayerCard = ({
  name,
  time,
  isNext,
  isPast,
  status,
  dhikrDone,
  onStatusChange,
  onStatusDelete,
  onDhikrToggle,
}: PrayerCardProps) => {
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);

  const getStatusColor = () => {
    if (status === "pending") return "bg-muted hover:bg-muted/80";
    if (status === "on-time") return "bg-success hover:bg-success/90";
    if (status === "late") return "bg-warning hover:bg-warning/90";
    if (status === "missed") return "bg-destructive hover:bg-destructive/90";
  };

  const getStatusIcon = () => {
    if (status === "on-time") return <CheckCircle2 className="w-5 h-5 text-success-foreground" />;
    if (status === "late") return <Clock className="w-5 h-5 text-warning-foreground" />;
    if (status === "missed") return <XCircle className="w-5 h-5 text-destructive-foreground" />;
    return null;
  };

  const handleStatusClick = (newStatus: PrayerStatus) => {
    onStatusChange(newStatus);
    setDialogOpen(false);
  };

  const hasSuccessBadge = status === "on-time" && dhikrDone;
  const borderColor = isNext ? "border-l-primary" : isPast ? "border-l-muted" : "border-l-muted";

  return (
    <>
      <Card className={`p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border-l-4 ${borderColor}`}>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{name}</h3>
              {isNext && (
                <Badge variant="outline" className="text-xs border-muted-foreground text-muted-foreground">
                  {t.nextPrayer}
                </Badge>
              )}
              {hasSuccessBadge && (
                <Badge className="text-xs bg-success text-success-foreground">
                  ✓ Succès
                </Badge>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{time}</p>
            
            {/* Dhikr checkbox */}
            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={dhikrDone}
                onChange={onDhikrToggle}
                className="w-4 h-4 accent-primary cursor-pointer"
                disabled={status === "pending"}
              />
              <span className="text-xs sm:text-sm text-muted-foreground">
                {dhikrDone ? t.dhikrDone : t.dhikrPending}
              </span>
            </div>
          </div>

          {/* Status color box */}
          <button
            onClick={() => setDialogOpen(true)}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg ${getStatusColor()} transition-all flex items-center justify-center cursor-pointer shadow-md flex-shrink-0`}
          >
            {getStatusIcon()}
          </button>
        </div>
      </Card>

      {/* Status selection dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {name} - {time}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => handleStatusClick("on-time")}
              className="w-full bg-success hover:bg-success/90 text-success-foreground"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {t.markOnTime}
            </Button>
            <Button
              onClick={() => handleStatusClick("late")}
              className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
              size="lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              {t.markLate}
            </Button>
            <Button
              onClick={() => handleStatusClick("missed")}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              size="lg"
            >
              <XCircle className="w-5 h-5 mr-2" />
              {t.markMissed}
            </Button>
            {status !== "pending" && (
              <Button
                onClick={() => {
                  onStatusDelete();
                  setDialogOpen(false);
                }}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                {t.deleteStatus}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
