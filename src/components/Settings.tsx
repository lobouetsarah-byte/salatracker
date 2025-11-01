import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Languages, User, Mail, Lock, LogOut, LogIn, Sunrise, Sunset } from "lucide-react";
import { NotificationSettings } from "@/hooks/useSettings";
import { useLanguage, Language } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: Partial<NotificationSettings>) => void;
}

export const Settings = ({ settings, onUpdateSettings }: SettingsProps) => {
  const { language, updateLanguage, t } = useLanguage();
  const { user, guestMode, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail || !user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      
      toast({
        title: t.emailUpdated,
        description: t.checkEmail,
      });
      setNewEmail("");
    } catch (error: any) {
      toast({
        title: t.errorOccurred,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      toast({
        title: t.passwordUpdated,
      });
      setNewPassword("");
    } catch (error: any) {
      toast({
        title: t.errorOccurred,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSignIn = () => {
    navigate("/auth");
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t.settings}</h2>
      
      {/* My Account Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-primary" />
            {t.myAccount}
          </CardTitle>
          <CardDescription>
            {user ? user.email : guestMode ? t.continueAsGuest : t.trackProgress}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user ? (
            <>
              {/* Current email display */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">{t.email}</p>
                <p className="font-medium">{user.email}</p>
              </div>

              {/* Update email */}
              <div className="space-y-2">
                <Label htmlFor="new-email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.updateEmail}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="new-email"
                    type="email"
                    placeholder={language === "fr" ? "Nouvel email" : "New email"}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleUpdateEmail} disabled={loading || !newEmail} className="w-full sm:w-auto">
                    {language === "fr" ? "Modifier" : "Update"}
                  </Button>
                </div>
              </div>

              {/* Update password */}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {t.updatePassword}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="new-password"
                    type="password"
                    placeholder={t.newPassword}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    className="flex-1"
                  />
                  <Button onClick={handleUpdatePassword} disabled={loading || !newPassword} className="w-full sm:w-auto">
                    {language === "fr" ? "Modifier" : "Update"}
                  </Button>
                </div>
              </div>

              {/* Sign out button */}
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.signOut}
                </Button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleSignIn}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t.signIn}
              </Button>
              <Button 
                className="w-full"
                onClick={() => navigate("/auth")}
              >
                {t.createAccount}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
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

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="space-y-1 flex-1">
              <Label htmlFor="morning-adhkar" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                <Sunrise className="w-4 h-4 text-primary" />
                {language === "fr" ? "Rappel adhkar du matin" : "Morning adhkar reminder"}
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
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

          <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="space-y-1 flex-1">
              <Label htmlFor="evening-adhkar" className="text-base font-medium flex items-center gap-2 cursor-pointer">
                <Sunset className="w-4 h-4 text-primary" />
                {language === "fr" ? "Rappel adhkar du soir" : "Evening adhkar reminder"}
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground">
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
