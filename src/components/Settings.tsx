import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Languages } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";
import { useLanguage, Language } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const Settings = ({ settings, onUpdateSettings }: SettingsProps) => {
  const { language, updateLanguage, t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t.settings}</h2>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Languages className="w-5 h-5 text-primary" />
            {t.languageSettings}
          </CardTitle>
          <CardDescription>
            {t.language}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => updateLanguage("fr")}
              variant={language === "fr" ? "default" : "outline"}
              className="h-12"
              size="lg"
            >
              {t.french}
            </Button>
            <Button
              onClick={() => updateLanguage("en")}
              variant={language === "en" ? "default" : "outline"}
              className="h-12"
              size="lg"
            >
              {t.english}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-primary" />
            {t.notificationSettings}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Gérez vos notifications" : "Manage your notifications"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="space-y-1 flex-1">
              <Label htmlFor="prayer-time" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                <Bell className="w-4 h-4 text-primary" />
                {t.prayerTimeNotifications}
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
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

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="space-y-1 flex-1">
              <Label htmlFor="missed-prayer" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                <Clock className="w-4 h-4 text-primary" />
                {t.missedPrayerReminders}
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
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
        </CardContent>
      </Card>

      <Card className="shadow-sm bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">{t.aboutNotifications}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs sm:text-sm text-muted-foreground">
          <p>{t.notificationPermission}</p>
        </CardContent>
      </Card>
    </div>
  );
};
