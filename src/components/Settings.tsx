import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Heart } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";
import { useLanguage } from "@/hooks/useLanguage";
import { SettingsAccount } from "./SettingsAccount";
import { Link } from "react-router-dom";
import { usePeriodMode } from "@/hooks/usePeriodMode";

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

      {/* Notification Settings */}
      <Card className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            Notifications de prière
          </CardTitle>
          <CardDescription className="text-sm">
            Activez les notifications pour les heures de prière avec l'adhan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 border border-primary/10">
            <div className="space-y-1.5 flex-1">
              <Label htmlFor="notifications" className="text-base font-semibold flex items-center gap-2 cursor-pointer">
                <div className="p-1.5 rounded bg-primary/20">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                Notifications de prière
              </Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Recevez une notification à chaque heure de prière avec l'adhan, et un rappel 30 minutes avant la prochaine prière si la précédente n'est pas cochée
              </p>
            </div>
            <Switch
              id="notifications"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) =>
                onUpdateSettings({ notificationsEnabled: checked })
              }
              className="data-[state=checked]:bg-primary"
            />
          </div>
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
