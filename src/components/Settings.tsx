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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="w-5 h-5" />
            {t.languageSettings}
          </CardTitle>
          <CardDescription>
            {t.language}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={() => updateLanguage("fr")}
              variant={language === "fr" ? "default" : "outline"}
              className="flex-1"
            >
              {t.french}
            </Button>
            <Button
              onClick={() => updateLanguage("en")}
              variant={language === "en" ? "default" : "outline"}
              className="flex-1"
            >
              {t.english}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {t.notificationSettings}
          </CardTitle>
          <CardDescription>
            {t.notificationSettings}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <Label htmlFor="prayer-time" className="text-base font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                {t.prayerTimeNotifications}
              </Label>
              <p className="text-sm text-muted-foreground">
                {language === "fr" ? "Soyez notifié lors de chaque heure de prière" : "Get notified when it's time for each prayer"}
              </p>
            </div>
            <Switch
              id="prayer-time"
              checked={settings.prayerTimeReminders}
              onCheckedChange={(checked) =>
                onUpdateSettings({ prayerTimeReminders: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <Label htmlFor="missed-prayer" className="text-base font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {t.missedPrayerReminders}
              </Label>
              <p className="text-sm text-muted-foreground">
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
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.aboutNotifications}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>{t.notificationPermission}</p>
        </CardContent>
      </Card>
    </div>
  );
};
