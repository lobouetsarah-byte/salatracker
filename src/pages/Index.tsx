import { useState, useEffect } from "react";
import { PrayerCard } from "@/components/PrayerCard";
import { WeeklyStats } from "@/components/WeeklyStats";
import { Settings } from "@/components/Settings";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerTracking } from "@/hooks/usePrayerTracking";
import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useSettings } from "@/hooks/useSettings";
import { MapPin, Calendar, Moon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { prayerTimes, loading } = usePrayerTimes();
  const { updatePrayerStatus, getPrayerStatus, getWeeklyStats } = usePrayerTracking();
  const { settings, updateSettings } = useSettings();
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
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

  const weeklyStats = getWeeklyStats();

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
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Moon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Prayer Tracker
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="prayers">Prayers</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <WeeklyStats stats={weeklyStats} />
          </TabsContent>

          <TabsContent value="prayers" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              Today's Prayers
            </h2>
            
            {prayerTimes?.prayers.map((prayer, index) => (
              <PrayerCard
                key={prayer.name}
                name={prayer.name}
                time={prayer.time}
                isNext={index === nextPrayerIndex}
                status={getPrayerStatus(today, prayer.name)}
                onStatusChange={(status) => updatePrayerStatus(today, prayer.name, status)}
              />
            ))}
          </TabsContent>

          <TabsContent value="settings">
            <Settings settings={settings} onUpdateSettings={updateSettings} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
          <p>May Allah accept all your prayers</p>
          <p className="mt-1">Prayer times provided by Aladhan API</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
