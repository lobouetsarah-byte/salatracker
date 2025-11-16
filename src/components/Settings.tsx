import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Sunrise, Sunset, Heart } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { SettingsAccount } from "./SettingsAccount";
import { Link } from "react-router-dom";
import { usePeriodMode } from "@/hooks/usePeriodMode";
import { LocationSettings } from "./LocationSettings";

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
  onLogout?: () => void;
  userGender?: string | null;
}

export const Settings = ({ settings, onUpdateSettings, onLogout, userGender }: SettingsProps) => {
  const { language, t } = useLanguage();
  const { isInPeriod, togglePeriodMode, loading } = usePeriodMode();
  
  // Only show period mode for female users
  const showPeriodMode = userGender === "female";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.settings}</h2>
        <p className="text-sm text-muted-foreground">Gérez vos préférences et votre compte</p>
      </div>
      
      {/* My Account Section */}
      <SettingsAccount onLogout={onLogout} />

      {/* Period Mode (Female users only) */}
      {showPeriodMode && (
        <Card className="shadow-lg border-pink-100 dark:border-pink-900/30 hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/20">
              <Heart className="w-5 h-5 text-pink-500" />
              </div>
              Mode Indisposée
            </CardTitle>
            <CardDescription className="text-sm">
              Pour suivre vos actions spirituelles pendant vos règles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/10 dark:to-pink-900/20 hover:from-pink-100 hover:to-pink-200 dark:hover:from-pink-900/20 dark:hover:to-pink-900/30 transition-all duration-300 border border-pink-200 dark:border-pink-900/30">
              <div className="space-y-1.5 flex-1">
                <Label htmlFor="period-mode" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                  <div className="p-1.5 rounded bg-pink-200 dark:bg-pink-900/40">
                    <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  Je suis indisposée
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Activez pour suivre vos dhikr et invocations au lieu des prières
                </p>
              </div>
              <Switch
                id="period-mode"
                checked={isInPeriod}
                onCheckedChange={togglePeriodMode}
                disabled={loading}
                className="data-[state=checked]:bg-pink-500"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Settings */}
      <LocationSettings />

      {/* Notification Settings */}
      <Card className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            {t.notificationSettings}
          </CardTitle>
          <CardDescription className="text-sm">
            Gérez vos notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 border border-primary/10">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="prayer-time" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                <div className="p-1.5 rounded bg-primary/20">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                {t.prayerTimeNotifications}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Soyez notifié lors de chaque heure de prière
              </p>
            </div>
            <Switch
              id="prayer-time"
              checked={settings.prayerTimeReminders}
              onCheckedChange={(checked) =>
                onUpdateSettings({ prayerTimeReminders: checked })
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 border border-primary/10">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="missed-prayer" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                <div className="p-1.5 rounded bg-primary/20">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                {t.missedPrayerReminders}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rappel 30 minutes avant la prochaine prière si la précédente n'est pas cochée
              </p>
            </div>
            <Switch
              id="missed-prayer"
              checked={settings.missedPrayerReminders}
              onCheckedChange={(checked) =>
                onUpdateSettings({ missedPrayerReminders: checked })
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 border border-primary/10">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="morning-adhkar" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                <div className="p-1.5 rounded bg-primary/20">
                  <Sunrise className="w-4 h-4 text-primary" />
                </div>
                Rappel adhkar du matin
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notification quotidienne pour les invocations du matin
              </p>
            </div>
            <Switch
              id="morning-adhkar"
              checked={settings.morningAdhkarReminder}
              onCheckedChange={(checked) =>
                onUpdateSettings({ morningAdhkarReminder: checked })
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 border border-primary/10">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="evening-adhkar" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                <div className="p-1.5 rounded bg-primary/20">
                  <Sunset className="w-4 h-4 text-primary" />
                </div>
                Rappel adhkar du soir
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Notification quotidienne pour les invocations du soir
              </p>
            </div>
            <Switch
              id="evening-adhkar"
              checked={settings.eveningAdhkarReminder}
              onCheckedChange={(checked) =>
                onUpdateSettings({ eveningAdhkarReminder: checked })
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded bg-primary/20">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            {t.aboutNotifications}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground leading-relaxed">
          <p>{t.notificationPermission}</p>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <div className="text-center text-xs text-muted-foreground pt-4 space-x-4">
        <Link to="/terms" className="hover:text-primary transition-colors underline">
          Conditions Générales
        </Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-primary transition-colors underline">
          Politique de Confidentialité
        </Link>
      </div>
    </div>
  );
};
