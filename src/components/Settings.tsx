import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Languages, Sunrise, Sunset } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { SettingsAccount } from "./SettingsAccount";
import { SettingsPermissions } from "./SettingsPermissions";

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const Settings = ({ settings, onUpdateSettings }: SettingsProps) => {
  const { language, updateLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.settings}</h2>
        <p className="text-sm text-muted-foreground">{language === "fr" ? "Gérez vos préférences et votre compte" : "Manage your preferences and account"}</p>
      </div>
      
      {/* My Account Section */}
      <SettingsAccount />
      
      {/* Language Settings */}
      <Card className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            {t.languageSettings}
          </CardTitle>
          <CardDescription className="text-sm">
            {t.language}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => updateLanguage("fr")}
              variant={language === "fr" ? "default" : "outline"}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              🇫🇷 {t.french}
            </Button>
            <Button
              onClick={() => updateLanguage("en")}
              variant={language === "en" ? "default" : "outline"}
              className="h-14 text-base font-semibold"
              size="lg"
            >
              🇬🇧 {t.english}
            </Button>
          </div>
        </CardContent>
      </Card>

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
            {language === "fr" ? "Gérez vos notifications" : "Manage your notifications"}
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
                {language === "fr" ? "Soyez notifié lors de chaque heure de prière" : "Get notified when it's time for each prayer"}
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
                {language === "fr" 
                  ? "Rappel 30 minutes avant la prochaine prière si la précédente n'est pas cochée" 
                  : "Get reminded 30 minutes before next prayer if you haven't checked the previous one"
                }
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
                {language === "fr" ? "Rappel adhkar du matin" : "Morning adhkar reminder"}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Notification quotidienne pour les invocations du matin" 
                  : "Daily reminder for morning supplications"
                }
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
                {language === "fr" ? "Rappel adhkar du soir" : "Evening adhkar reminder"}
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {language === "fr" 
                  ? "Notification quotidienne pour les invocations du soir" 
                  : "Daily reminder for evening supplications"
                }
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

      {/* Permissions Section */}
      <SettingsPermissions />

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
    </div>
  );
};
