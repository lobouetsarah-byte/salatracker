import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/SplashScreen";
import { PrayerCard } from "@/components/PrayerCard";
import { WeeklyStats } from "@/components/WeeklyStats";
import { Settings } from "@/components/Settings";
import { Atkar } from "@/components/Atkar";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerTrackingSync } from "@/hooks/usePrayerTrackingSync";
import { useDhikrTrackingSync } from "@/hooks/useDhikrTrackingSync";
import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useNativeNotifications } from "@/hooks/useNativeNotifications";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { Capacitor } from "@capacitor/core";
import { MapPin, Calendar, BarChart3, Clock, BookOpen, Settings as SettingsIcon } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NotificationPermissionPrompt } from "@/components/NotificationPermissionPrompt";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const { prayerTimes, loading } = usePrayerTimes();
  const { updatePrayerStatus, deletePrayerStatus, getPrayerStatus, getStats, getCustomStats, loading: dataLoading } = usePrayerTrackingSync();
  const { toggleDhikr, getDhikrStatus } = useDhikrTrackingSync();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const [statsPeriod, setStatsPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<string>("prayers");
  const today = new Date().toISOString().split("T")[0];

  // Redirect to onboarding after splash screen if not logged in
  useEffect(() => {
    if (!showSplash && !authLoading && !user) {
      navigate("/onboarding");
    }
  }, [showSplash, user, authLoading, navigate]);

  // Use native notifications on mobile, web notifications otherwise
  const isNative = Capacitor.isNativePlatform();
  
  if (isNative) {
    useNativeNotifications(
      prayerTimes?.prayers || [],
      getPrayerStatus,
      settings
    );
  } else {
    usePrayerNotifications(
      prayerTimes?.prayers || [],
      getPrayerStatus,
      settings
    );
  }

  useEffect(() => {
    if (prayerTimes?.prayers) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const nextIndex = prayerTimes.prayers.findIndex((prayer) => {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerMinutes = hours * 60 + minutes;
        return prayerMinutes > currentMinutes;
      });

      setNextPrayerIndex(nextIndex === -1 ? 0 : nextIndex);
    }
  }, [prayerTimes]);

  const isPrayerPast = (prayerTime: string) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const prayerMinutes = hours * 60 + minutes;
    return prayerMinutes < currentMinutes;
  };

  const stats = getStats(statsPeriod);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading || authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 pb-20">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={salatrackLogo} alt="Salatrack" className="w-10 h-10 sm:w-12 sm:h-12" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{prayerTimes?.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{prayerTimes?.location}</span>
            </div>
          </div>
        </div>

        {/* Notifications permission prompt */}
        <NotificationPermissionPrompt />

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <WeeklyStats 
                stats={stats} 
                period={statsPeriod}
                onPeriodChange={setStatsPeriod}
                getCustomStats={getCustomStats}
              />
            </div>
          )}

          {activeTab === "prayers" && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {t.prayers}
              </h2>
              
              {prayerTimes?.prayers.map((prayer, index) => (
                <PrayerCard
                  key={prayer.name}
                  name={prayer.name}
                  time={prayer.time}
                  isNext={index === nextPrayerIndex}
                  isPast={isPrayerPast(prayer.time)}
                  status={getPrayerStatus(today, prayer.name)}
                  dhikrDone={getDhikrStatus(today, prayer.name)}
                  onStatusChange={(status) => updatePrayerStatus(today, prayer.name, status)}
                  onStatusDelete={() => deletePrayerStatus(today, prayer.name)}
                  onDhikrToggle={() => toggleDhikr(today, prayer.name)}
                />
              ))}
            </div>
          )}

          {activeTab === "atkar" && (
            <Atkar />
          )}

          {activeTab === "settings" && (
            <Settings settings={settings} onUpdateSettings={updateSettings} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-8 border-t border-border">
          <p>{t.footer}</p>
          <p className="mt-1">{t.prayerTimesProvider}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border shadow-lg z-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 h-16">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveTab("prayers")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === "prayers" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs font-medium">{t.prayers}</span>
            </button>
            <button
              onClick={() => setActiveTab("atkar")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === "atkar" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-xs font-medium">{t.atkar}</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                activeTab === "settings" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
