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
  const { t, language } = useLanguage();
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
  const borderColor = isNext && !isPast ? "border-l-primary" : isPast ? "border-l-muted-foreground/30" : "border-l-muted";
  const cardBg = hasSuccessBadge ? "bg-gradient-to-br from-success/5 to-success/10" : "";

  return (
    <>
      <Card className={`p-3 sm:p-4 hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} ${cardBg} ${isPast ? "opacity-40" : ""}`}>
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">{name}</h3>
              {isNext && (
                <Badge variant="outline" className="text-xs border-muted-foreground/50 text-muted-foreground bg-muted/30">
                  {t.nextPrayer}
                </Badge>
              )}
              {hasSuccessBadge && (
                <Badge className="text-xs bg-success text-success-foreground shadow-sm">
                  ✓ {language === "fr" ? "Succès" : "Success"}
                </Badge>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-primary">{time}</p>
            
            {/* Dhikr checkbox */}
            <button
              onClick={onDhikrToggle}
              disabled={status === "pending"}
              className="mt-3 flex items-center gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <input
                type="checkbox"
                checked={dhikrDone}
                onChange={() => {}}
                className="w-4 h-4 accent-primary cursor-pointer transition-transform hover:scale-110 pointer-events-none"
                disabled={status === "pending"}
              />
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                {dhikrDone ? t.dhikrDone : t.dhikrPending}
              </span>
            </button>
          </div>

          {/* Status color box */}
          <button
            onClick={() => setDialogOpen(true)}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg ${getStatusColor()} transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md hover:shadow-lg hover:scale-105 flex-shrink-0`}
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
