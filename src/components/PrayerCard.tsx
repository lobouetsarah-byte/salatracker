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
  const cardBg = hasSuccessBadge ? "bg-gradient-to-br from-success/5 to-success/10" : isPast ? "bg-muted/20" : "";
  const textOpacity = isPast ? "opacity-50" : "";

  return (
    <>
      <Card 
        className={`p-4 sm:p-5 hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} ${cardBg} ${isPast ? "opacity-60 grayscale" : ""} backdrop-blur-sm hover:scale-[1.01]`}
      >
        <div className="flex items-center justify-between gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h3 className={`text-xl sm:text-2xl font-bold text-foreground ${textOpacity}`}>{name}</h3>
              {isNext && !isPast && (
                <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/10 animate-pulse">
                  {t.nextPrayer}
                </Badge>
              )}
              {hasSuccessBadge && (
                <Badge className="text-xs bg-success text-success-foreground shadow-sm animate-fade-in">
                  ✓ Succès
                </Badge>
              )}
            </div>
            <p className={`text-2xl sm:text-3xl font-bold mb-3 ${isPast ? "text-muted-foreground" : "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"}`}>{time}</p>
            
            {/* Dhikr checkbox */}
            {status !== "pending" && (
              <label
                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300 w-full cursor-pointer border border-border/30 hover:border-primary/30"
              >
                <input
                  type="checkbox"
                  checked={dhikrDone}
                  onChange={onDhikrToggle}
                  className="w-5 h-5 rounded-md border-2 border-muted-foreground/50 text-primary focus:ring-2 focus:ring-primary cursor-pointer transition-all"
                />
                <span className="text-sm sm:text-base font-medium">
                  {dhikrDone ? t.dhikrDone : t.dhikrPending}
                </span>
              </label>
            )}
          </div>

          {/* Status color box - clickable */}
          <div
            onClick={() => setDialogOpen(true)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${getStatusColor()} transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 flex-shrink-0 cursor-pointer`}
          >
            {getStatusIcon()}
          </div>
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
