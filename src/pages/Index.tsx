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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { prayerTimes, loading } = usePrayerTimes();
  const { updatePrayerStatus, deletePrayerStatus, getPrayerStatus, getStats, getCustomStats, loading: dataLoading } = usePrayerTrackingSync();
  const { toggleDhikr, getDhikrStatus } = useDhikrTrackingSync();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const [statsPeriod, setStatsPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<string>("prayers");
  const today = new Date().toISOString().split("T")[0];

  // No automatic redirect - users can use the app without logging in

  // Handle logout splash screen
  useEffect(() => {
    if (isLoggingOut && showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        setIsLoggingOut(false);
        navigate("/auth");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isLoggingOut, showSplash, navigate]);

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
    setIsLoggingOut(true);
    await signOut();
    setShowSplash(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => {
      if (!isLoggingOut) {
        setShowSplash(false);
      }
    }} />;
  }

  if (loading || dataLoading) {
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
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="bg-primary/10 p-3 rounded-2xl backdrop-blur-sm">
              <img src={salatrackLogo} alt="Salatrack" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">{prayerTimes?.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{prayerTimes?.location}</span>
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
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t.prayers}
                </h2>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-primary">
                    {stats.onTime + stats.late}/{stats.total}
                  </span>
                </div>
              </div>
              
              {prayerTimes?.prayers.map((prayer, index) => (
                <div key={prayer.name} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <PrayerCard
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
                </div>
              ))}
            </div>
          )}

          {activeTab === "atkar" && (
            <Atkar />
          )}

          {activeTab === "settings" && (
            <Settings settings={settings} onUpdateSettings={updateSettings} onLogout={handleSignOut} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-8 border-t border-border">
          <p>{t.footer}</p>
          <p className="mt-1">{t.prayerTimesProvider}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-4 h-16 sm:h-18">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "dashboard" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "dashboard" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium">{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveTab("prayers")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "prayers" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "prayers" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium">{t.prayers}</span>
            </button>
            <button
              onClick={() => setActiveTab("atkar")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "atkar" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "atkar" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium">{t.atkar}</span>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "settings" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "settings" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium">{t.settings}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
