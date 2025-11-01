import { useState, useEffect } from "react";
import { PrayerCard } from "@/components/PrayerCard";
import { WeeklyStats } from "@/components/WeeklyStats";
import { Settings } from "@/components/Settings";
import { Atkar } from "@/components/Atkar";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerTracking } from "@/hooks/usePrayerTracking";
import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useSettings } from "@/hooks/useSettings";
import { useDhikrTracking } from "@/hooks/useDhikrTracking";
import { useLanguage } from "@/hooks/useLanguage";
import { MapPin, Calendar, Moon, BarChart3, Clock, BookOpen, Settings as SettingsIcon } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { prayerTimes, loading } = usePrayerTimes();
  const { updatePrayerStatus, deletePrayerStatus, getPrayerStatus, getStats } = usePrayerTracking();
  const { toggleDhikr, getDhikrStatus } = useDhikrTracking();
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const [statsPeriod, setStatsPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const today = new Date().toISOString().split("T")[0];

  usePrayerNotifications(
    prayerTimes?.prayers || [],
    getPrayerStatus,
    settings
  );

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

  if (loading) {
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

        {/* Tabs */}
        <Tabs defaultValue="prayers" className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
            <TabsTrigger value="prayers">{t.prayers}</TabsTrigger>
            <TabsTrigger value="atkar">{t.atkar}</TabsTrigger>
            <TabsTrigger value="settings">{t.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4 mt-0">
            <WeeklyStats 
              stats={stats} 
              period={statsPeriod}
              onPeriodChange={setStatsPeriod}
            />
          </TabsContent>

          <TabsContent value="prayers" className="space-y-4 mt-0">
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
          </TabsContent>

          <TabsContent value="atkar" className="mt-0">
            <Atkar />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <Settings settings={settings} onUpdateSettings={updateSettings} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-8 border-t border-border">
          <p>{t.footer}</p>
          <p className="mt-1">{t.prayerTimesProvider}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="prayers" className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-16 rounded-none bg-transparent">
              <TabsTrigger value="dashboard" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs">{t.dashboard}</span>
              </TabsTrigger>
              <TabsTrigger value="prayers" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                <Clock className="w-5 h-5" />
                <span className="text-xs">{t.prayers}</span>
              </TabsTrigger>
              <TabsTrigger value="atkar" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs">{t.atkar}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                <SettingsIcon className="w-5 h-5" />
                <span className="text-xs">{t.settings}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
