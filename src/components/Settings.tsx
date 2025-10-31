import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const Settings = ({ settings, onUpdateSettings }: SettingsProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage your prayer reminder notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <Label htmlFor="prayer-time" className="text-base font-medium flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Prayer Time Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when it's time for each prayer
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
                Missed Prayer Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Get reminded 30 minutes before next prayer if you haven't checked the previous one
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
          <CardTitle>About Notifications</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Browser notifications require your permission. If you haven't granted permission yet, 
            you'll be prompted when notifications are enabled.
          </p>
          <p>
            Make sure notifications are allowed in your browser settings for the best experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
