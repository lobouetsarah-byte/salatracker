import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, Trash2, LogIn, Heart, Sparkles, BookHeart } from "lucide-react";
import { PrayerStatus } from "@/hooks/usePrayerTracking";
import { useLanguage } from "@/hooks/useLanguage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DhikrType } from "@/hooks/usePeriodDhikrTracking";

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
  isPeriodMode?: boolean;
  periodDhikrType?: DhikrType | null;
  onPeriodDhikrChange?: (type: DhikrType | null) => void;
  selectedDate?: string; // Add to check if it's today
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
  isPeriodMode = false,
  periodDhikrType = null,
  onPeriodDhikrChange,
  selectedDate,
}: PrayerCardProps) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);

  // Check if prayer time has arrived (Adhan notification time)
  const isPrayerTimeArrived = () => {
    const today = new Date().toISOString().split("T")[0];
    
    // If selected date is in the past, prayer time has arrived
    if (selectedDate && selectedDate < today) return true;
    
    // If selected date is in the future, prayer time hasn't arrived yet
    if (selectedDate && selectedDate > today) return false;
    
    // If it's today, check the actual time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = time.split(":").map(Number);
    const prayerMinutes = hours * 60 + minutes;
    
    return currentMinutes >= prayerMinutes;
  };

  const canMarkCompleted = isPrayerTimeArrived();

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
    if (!user) {
      setDialogOpen(false);
      setLoginPromptOpen(true);
      return;
    }
    onStatusChange(newStatus);
    setDialogOpen(false);
  };

  const handleDhikrToggle = () => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    onDhikrToggle();
  };

  const handleStatusDialogOpen = () => {
    if (!user) {
      setLoginPromptOpen(true);
      return;
    }
    if (!canMarkCompleted) {
      // Don't open dialog if prayer time hasn't arrived
      return;
    }
    setDialogOpen(true);
  };

  const hasSuccessBadge = isPeriodMode ? (periodDhikrType !== null) : (status === "on-time" && dhikrDone);
  const borderColor = isPeriodMode 
    ? "border-l-[hsl(var(--period-button))]"
    : isNext && !isPast ? "border-l-primary" : isPast ? "border-l-muted-foreground/30" : "border-l-muted";
  const cardBg = isPeriodMode
    ? "bg-gradient-to-br from-[hsl(var(--period-card))]/80 to-[hsl(var(--period-accent))]/50"
    : hasSuccessBadge ? "bg-gradient-to-br from-success/5 to-success/10" : isPast ? "bg-muted/20" : "";

  return (
    <>
      <Card 
        className={`p-4 sm:p-5 hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor} ${cardBg} backdrop-blur-sm hover:scale-[1.01] ${isPeriodMode ? "border-[hsl(var(--period-border))]" : ""}`}
      >
        <div className="flex items-center justify-between gap-4 sm:gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h3 className={`text-xl sm:text-2xl font-bold ${isPeriodMode ? "text-[hsl(var(--period-text))]" : "text-foreground"}`}>{name}</h3>
              {isNext && !isPast && (
                <Badge variant="outline" className="text-xs border-primary/50 text-primary bg-primary/10 animate-pulse">
                  {t.nextPrayer}
                </Badge>
              )}
              {hasSuccessBadge && (
                <Badge className={`text-xs shadow-sm animate-fade-in ${
                  isPeriodMode 
                    ? "bg-white text-black border border-[hsl(var(--period-border))]" 
                    : "bg-success text-success-foreground"
                }`}>
                  ✓ Succès
                </Badge>
              )}
            </div>
            <p className={`text-2xl sm:text-3xl font-bold mb-3 ${isPast ? "text-muted-foreground" : "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"}`}>{time}</p>
            
            {/* Period Mode - Enhanced Dhikr/Invocation tracking */}
            {isPeriodMode && isPast && (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-[hsl(var(--period-text))]/80">
                    Action spirituelle :
                  </p>
                  {periodDhikrType && (
                    <Badge className="text-xs bg-white text-[hsl(var(--period-text))] border-[hsl(var(--period-border))]">
                      ✓ Complété
                    </Badge>
                  )}
                </div>
                
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canMarkCompleted}
                    onClick={() => {
                      if (!user) {
                        setLoginPromptOpen(true);
                        return;
                      }
                      onPeriodDhikrChange?.(periodDhikrType === "dhikr" ? null : "dhikr");
                    }}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      !canMarkCompleted
                        ? "opacity-50 cursor-not-allowed"
                        : periodDhikrType === "dhikr" 
                          ? "bg-[hsl(var(--period-button))] hover:bg-[hsl(var(--period-button-hover))] text-white border-[hsl(var(--period-button))] shadow-md scale-105" 
                          : "border-[hsl(var(--period-border))] text-[hsl(var(--period-text))] bg-white hover:bg-[hsl(var(--period-accent))] hover:border-[hsl(var(--period-button))]"
                    }`}
                  >
                    <Heart className={`w-4 h-4 mr-1 ${periodDhikrType === "dhikr" ? "animate-pulse" : ""}`} />
                    Dhikr
                    {periodDhikrType === "dhikr" && (
                      <CheckCircle2 className="w-3 h-3 ml-1 animate-scale-in" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canMarkCompleted}
                    onClick={() => {
                      if (!user) {
                        setLoginPromptOpen(true);
                        return;
                      }
                      onPeriodDhikrChange?.(periodDhikrType === "invocation" ? null : "invocation");
                    }}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      !canMarkCompleted
                        ? "opacity-50 cursor-not-allowed"
                        : periodDhikrType === "invocation" 
                          ? "bg-[hsl(var(--period-button))] hover:bg-[hsl(var(--period-button-hover))] text-white border-[hsl(var(--period-button))] shadow-md scale-105" 
                          : "border-[hsl(var(--period-border))] text-[hsl(var(--period-text))] bg-white hover:bg-[hsl(var(--period-accent))] hover:border-[hsl(var(--period-button))]"
                    }`}
                  >
                    <BookHeart className={`w-4 h-4 mr-1 ${periodDhikrType === "invocation" ? "animate-pulse" : ""}`} />
                    Invocation
                    {periodDhikrType === "invocation" && (
                      <CheckCircle2 className="w-3 h-3 ml-1 animate-scale-in" />
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canMarkCompleted}
                    onClick={() => {
                      if (!user) {
                        setLoginPromptOpen(true);
                        return;
                      }
                      onPeriodDhikrChange?.(periodDhikrType === "remembrance" ? null : "remembrance");
                    }}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      !canMarkCompleted
                        ? "opacity-50 cursor-not-allowed"
                        : periodDhikrType === "remembrance" 
                          ? "bg-[hsl(var(--period-button))] hover:bg-[hsl(var(--period-button-hover))] text-white border-[hsl(var(--period-button))] shadow-md scale-105" 
                          : "border-[hsl(var(--period-border))] text-[hsl(var(--period-text))] bg-white hover:bg-[hsl(var(--period-accent))] hover:border-[hsl(var(--period-button))]"
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 mr-1 ${periodDhikrType === "remembrance" ? "animate-pulse" : ""}`} />
                    Rappel
                    {periodDhikrType === "remembrance" && (
                      <CheckCircle2 className="w-3 h-3 ml-1 animate-scale-in" />
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Normal Mode - Enhanced Dhikr Toggle */}
            {!isPeriodMode && status !== "pending" && (
              <div className="relative">
                <div 
                  onClick={canMarkCompleted ? handleDhikrToggle : undefined}
                  className={`group relative p-4 rounded-xl transition-all duration-300 border-2 ${
                    !canMarkCompleted 
                      ? "opacity-50 cursor-not-allowed bg-muted/10 border-muted/30" 
                      : dhikrDone 
                        ? "cursor-pointer bg-gradient-to-br from-success/10 to-success/20 border-success/40 hover:border-success/60 shadow-md" 
                        : "cursor-pointer bg-gradient-to-br from-muted/20 to-muted/30 border-border/40 hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Custom Checkbox */}
                    <div className={`relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-300 ${
                      dhikrDone 
                        ? "bg-success scale-100" 
                        : "bg-muted border-2 border-muted-foreground/40 group-hover:border-primary/60"
                    }`}>
                      {dhikrDone && (
                        <CheckCircle2 className="w-5 h-5 text-white animate-scale-in" />
                      )}
                    </div>
                    
                    {/* Label */}
                    <div className="flex-1">
                      <p className={`text-sm sm:text-base font-semibold transition-colors duration-300 ${
                        dhikrDone ? "text-success" : "text-foreground group-hover:text-primary"
                      }`}>
                        {dhikrDone ? "✓ " + t.dhikrDone : t.dhikrPending}
                      </p>
                      {!dhikrDone && canMarkCompleted && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Cliquez pour marquer comme fait
                        </p>
                      )}
                    </div>
                    
                    {/* Icon indicator */}
                    {dhikrDone ? (
                      <Sparkles className="w-5 h-5 text-success animate-pulse" />
                    ) : (
                      <Heart className={`w-5 h-5 transition-colors ${
                        canMarkCompleted 
                          ? "text-muted-foreground group-hover:text-primary" 
                          : "text-muted-foreground/40"
                      }`} />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status color box - clickable (hidden in period mode) */}
          {!isPeriodMode && (
            <div className="relative">
              <div
                onClick={handleStatusDialogOpen}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${getStatusColor()} transition-all duration-300 flex items-center justify-center shadow-lg flex-shrink-0 ${
                  canMarkCompleted 
                    ? "cursor-pointer hover:shadow-xl hover:scale-110 active:scale-95" 
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                {getStatusIcon()}
                {!canMarkCompleted && status === "pending" && (
                  <Clock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
          )}
          
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
              disabled={!canMarkCompleted}
              className="w-full bg-success hover:bg-success/90 text-success-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              {t.markOnTime}
            </Button>
            <Button
              onClick={() => handleStatusClick("late")}
              disabled={!canMarkCompleted}
              className="w-full bg-warning hover:bg-warning/90 text-warning-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              {t.markLate}
            </Button>
            <Button
              onClick={() => handleStatusClick("missed")}
              disabled={!canMarkCompleted}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Login prompt dialog */}
      <Dialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connexion requise</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <p className="text-muted-foreground">
              Vous devez vous connecter pour utiliser les fonctionnalités de suivi des prières.
            </p>
            <Button
              onClick={() => navigate("/auth")}
              className="w-full"
              size="lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Se connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
