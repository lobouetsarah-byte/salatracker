import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrayerCard } from "@/components/PrayerCard";
import { WeeklyStats } from "@/components/WeeklyStats";
import { Settings } from "@/components/Settings";
import { Adhkar } from "@/components/Adhkar";
import { WeeklyHadith } from "@/components/WeeklyHadith";
import { PeriodStats } from "@/components/PeriodStats";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerTrackingSync } from "@/hooks/usePrayerTrackingSync";
import { useDhikrTrackingSync } from "@/hooks/useDhikrTrackingSync";
import { usePeriodMode } from "@/hooks/usePeriodMode";
import { usePeriodDhikrTracking, DhikrType } from "@/hooks/usePeriodDhikrTracking";
import { usePeriodNotifications } from "@/hooks/usePeriodNotifications";
import { useBadges } from "@/hooks/useBadges";
import { DailySuccess } from "@/components/DailySuccess";
import { usePrayerNotifications } from "@/hooks/usePrayerNotifications";
import { useNativeNotifications } from "@/hooks/useNativeNotifications";
import { useSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { useLocationSettings } from "@/hooks/useLocationSettings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Capacitor } from "@capacitor/core";
import { MapPin, Calendar as CalendarIcon, BarChart3, Clock, BookOpen, Settings as SettingsIcon, Heart, Edit3 } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import salatrackLogoPink from "@/assets/salatrack-logo-pink.png";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { NotificationPermissionPrompt } from "@/components/NotificationPermissionPrompt";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PrayerStatus } from "@/hooks/usePrayerTracking";
import { LocationDialog } from "@/components/LocationDialog";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userGender, setUserGender] = useState<string | null>(null);
  const { settings: locationSettings } = useLocationSettings();
  const { prayerTimes, loading, locationName, isManualMode } = usePrayerTimes({ locationSettings });
  const { updatePrayerStatus, deletePrayerStatus, getPrayerStatus, getStats, getCustomStats, loading: dataLoading } = usePrayerTrackingSync();
  const { toggleDhikr, getDhikrStatus } = useDhikrTrackingSync();
  const { isInPeriod } = usePeriodMode();
  const { setDhikrForPrayer, getDhikrForPrayer } = usePeriodDhikrTracking();
  const { checkDailyCompletion, checkWeeklyBadges, checkMonthlyBadges, checkPeriodBadges } = useBadges();
  const [showDailySuccess, setShowDailySuccess] = useState(false);
  const { settings, updateSettings } = useSettings();
  const { t } = useLanguage();
  const [nextPrayerIndex, setNextPrayerIndex] = useState<number>(0);
  const [statsPeriod, setStatsPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<string>("prayers");
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedDateString = selectedDate.toISOString().split("T")[0];
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  // No automatic redirect - users can use the app without logging in

  // Load user gender for period mode
  useEffect(() => {
    const loadGender = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('gender')
          .eq('id', user.id)
          .maybeSingle();
        
        if (data) {
          setUserGender(data.gender);
        }
      }
    };
    
    loadGender();
  }, [user]);

  // Use native notifications on mobile, web notifications otherwise
  const isNative = Capacitor.isNativePlatform();
  
  // Period notifications (always web-based)
  usePeriodNotifications({
    prayers: prayerTimes?.prayers || [],
    isInPeriod,
    settings,
  });
  
  // Regular prayer notifications - hooks must be called unconditionally
  useNativeNotifications(
    prayerTimes?.prayers || [],
    getPrayerStatus,
    settings,
    isNative && !isInPeriod // Pass condition as parameter
  );
  
  usePrayerNotifications(
    prayerTimes?.prayers || [],
    getPrayerStatus,
    settings,
    !isNative && !isInPeriod // Pass condition as parameter
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

  // Check daily completion and badges in real-time after prayer/dhikr updates
  const checkBadgesRealTime = async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Only check for today's date
    if (selectedDateString !== today) return;
    
    // Check if all prayers/acts are completed for today
    const isComplete = await checkDailyCompletion(today, isInPeriod);
    
    if (isComplete) {
      setShowDailySuccess(true);
    }
    
    // Check all badges
    await checkWeeklyBadges(isInPeriod);
    await checkMonthlyBadges(isInPeriod);
    
    if (isInPeriod) {
      await checkPeriodBadges();
    }
  };

  // Enhanced prayer status update with badge checking
  const handlePrayerStatusUpdate = async (date: string, prayerName: string, status: PrayerStatus) => {
    await updatePrayerStatus(date, prayerName, status);
    
    // Show immediate success message for on-time prayers
    if (status === "on-time" && date === today) {
      toast({
        title: "🕌 Prière à l'heure !",
        description: `${prayerName} accomplie à l'heure. Continuez ainsi !`,
        duration: 4000,
      });
    }
    
    await checkBadgesRealTime();
  };

  // Enhanced dhikr toggle with badge checking
  const handleDhikrToggle = async (date: string, prayerName: string) => {
    const wasDone = getDhikrStatus(date, prayerName);
    await toggleDhikr(date, prayerName);
    
    // Show success message when completing dhikr (not when unchecking)
    if (!wasDone && date === today) {
      toast({
        title: "✨ Dhikr accompli !",
        description: `Dhikr après ${prayerName} complété`,
        duration: 3000,
      });
    }
    
    await checkBadgesRealTime();
  };

  // Enhanced period dhikr change with badge checking
  const handlePeriodDhikrChange = async (date: string, prayerName: string, type: any) => {
    const previousType = getDhikrForPrayer(date, prayerName);
    await setDhikrForPrayer(date, prayerName, type);
    
    // Show success message when adding a dhikr type (not when changing or removing)
    if (!previousType && type && date === today) {
      const dhikrNames: { [key: string]: string } = {
        "quran": "📖 Lecture du Coran",
        "dhikr": "🤲 Dhikr",
        "dua": "🤲 Dou'a",
        "charity": "💝 Aumône",
        "islamic-learning": "📚 Apprentissage islamique"
      };
      
      toast({
        title: "🌸 Acte spirituel accompli !",
        description: `${dhikrNames[type] || "Acte spirituel"} pour ${prayerName}`,
        duration: 3000,
      });
    }
    
    await checkBadgesRealTime();
  };

  const isPrayerPast = (prayerTime: string) => {
    const now = new Date();
    const selectedIsToday = selectedDateString === today;
    
    // If selected date is in the past, all prayers are past
    if (selectedDateString < today) return true;
    
    // If selected date is in the future, no prayers are past
    if (selectedDateString > today) return false;
    
    // If selected date is today, check the time
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const prayerMinutes = hours * 60 + minutes;
    return prayerMinutes < currentMinutes;
  };

  const stats = getStats(statsPeriod);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await signOut();
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-white p-6">
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
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${isInPeriod ? "period-mode bg-[hsl(var(--period-bg))]" : "bg-white dark:bg-white"}`}>
      {/* Fixed Header with Logo */}
      <div 
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-500 ${
          isInPeriod 
            ? "bg-[hsl(var(--period-bg))]" 
            : "bg-background"
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-4">
            <div className={`p-2.5 rounded-xl ${isInPeriod ? "bg-white/20" : "bg-primary/10"}`}>
              <img 
                src={isInPeriod ? salatrackLogoPink : salatrackLogo} 
                alt="Salatracker" 
                className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-lg" 
              />
            </div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              isInPeriod 
                ? "text-[hsl(var(--period-text))] drop-shadow-lg" 
                : "bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent"
            }`}>
              {t.appTitle}
            </h1>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8" style={{ paddingTop: 'calc(96px + env(safe-area-inset-top))' }}>
        {/* Date Picker and Location (Prayers Tab Only) */}
        <div className="animate-fade-in">
          {activeTab === "prayers" && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:bg-card/70 hover:border-primary/30 transition-all cursor-pointer">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">{format(selectedDate, "dd MMMM yyyy", { locale: fr })}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setDatePickerOpen(false);
                      }
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <button 
                className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 hover:bg-card/70 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => setLocationDialogOpen(true)}
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-medium">
                  {locationName}
                  {isManualMode && (
                    <span className="ml-2 text-xs text-primary">(manuel)</span>
                  )}
                </span>
                <Edit3 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}
        </div>

        {/* Notifications permission prompt */}
        <NotificationPermissionPrompt />
        
        {/* Daily success dialog */}
        <DailySuccess 
          open={showDailySuccess} 
          onClose={() => setShowDailySuccess(false)}
          isInPeriod={isInPeriod}
        />

        {/* Location dialog */}
        <LocationDialog 
          open={locationDialogOpen}
          onOpenChange={setLocationDialogOpen}
        />

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Hadith du jour */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                  Hadith du jour
                </h2>
                <WeeklyHadith />
              </div>
              
              <WeeklyStats 
                stats={stats} 
                period={statsPeriod}
                onPeriodChange={setStatsPeriod}
                getCustomStats={getCustomStats}
              />
              {isInPeriod && <PeriodStats />}
            </div>
          )}

          {activeTab === "prayers" && (
            <div className="space-y-4 animate-fade-in">
              {isInPeriod && (
                <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-[hsl(var(--period-card))] to-[hsl(var(--period-accent))] border-2 border-[hsl(var(--period-border))] shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-[hsl(var(--period-text))]">Mode Indisposée Activé</h3>
                  </div>
                  <p className="text-sm text-[hsl(var(--period-text))]/80">
                    Suivez vos dhikr et invocations. Les prières ne sont pas suivies pendant cette période.
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {t.prayers}
                </h2>
                {isInPeriod ? (
                  <div className="bg-[hsl(var(--period-button))]/20 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-[hsl(var(--period-text))]">
                      {(() => {
                        const count = prayerTimes?.prayers.filter(prayer => {
                          const dhikrType = getDhikrForPrayer(selectedDateString, prayer.name);
                          return dhikrType !== null;
                        }).length || 0;
                        return `${count}/${prayerTimes?.prayers.length || 5}`;
                      })()}
                    </span>
                  </div>
                ) : (
                  <div className="bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-primary">
                      {stats.onTime + stats.late}/{stats.total}
                    </span>
                  </div>
                )}
              </div>
              
              {prayerTimes?.prayers.map((prayer, index) => (
                <div key={prayer.name} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                  <PrayerCard
                    name={prayer.name}
                    time={prayer.time}
                    isNext={index === nextPrayerIndex && selectedDateString === today}
                    isPast={isPrayerPast(prayer.time)}
                    status={getPrayerStatus(selectedDateString, prayer.name)}
                    dhikrDone={getDhikrStatus(selectedDateString, prayer.name)}
                    onStatusChange={(status) => handlePrayerStatusUpdate(selectedDateString, prayer.name, status)}
                    onStatusDelete={() => deletePrayerStatus(selectedDateString, prayer.name)}
                    onDhikrToggle={() => handleDhikrToggle(selectedDateString, prayer.name)}
                    isPeriodMode={isInPeriod}
                    periodDhikrType={getDhikrForPrayer(selectedDateString, prayer.name)}
                    onPeriodDhikrChange={(type) => handlePeriodDhikrChange(selectedDateString, prayer.name, type)}
                    selectedDate={selectedDateString}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "adhkar" && (
            <Adhkar onCompletion={checkBadgesRealTime} />
          )}

          {activeTab === "settings" && (
            <Settings 
              settings={settings} 
              onUpdateSettings={updateSettings} 
              onLogout={handleSignOut}
              userGender={userGender}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs sm:text-sm text-muted-foreground pt-8 border-t border-border">
          <p>{t.footer}</p>
          <p className="mt-1">{t.prayerTimesProvider}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border/50 shadow-2xl z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
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
              onClick={() => setActiveTab("adhkar")}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 relative ${
                activeTab === "adhkar" 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {activeTab === "adhkar" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />
              )}
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs font-medium">{t.adhkar}</span>
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
