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
    navigate("/auth?tab=login");
  };
  
  const handleSignUp = () => {
    navigate("/auth?tab=signup");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.settings}</h2>
        <p className="text-sm text-muted-foreground">{language === "fr" ? "Gérez vos préférences et votre compte" : "Manage your preferences and account"}</p>
      </div>
      
      {/* My Account Section */}
      <Card className="shadow-lg border-primary/10 hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="space-y-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            {t.myAccount}
          </CardTitle>
          {user && (
            <CardDescription className="text-base">
              {user.email}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-5">
          {user ? (
            <>
              {/* Update email */}
              <div className="space-y-3">
                <Label htmlFor="new-email" className="flex items-center gap-2 text-base font-semibold">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  {t.updateEmail}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="new-email"
                    type="email"
                    placeholder={language === "fr" ? "Nouvel email" : "New email"}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1 h-11"
                  />
                  <Button onClick={handleUpdateEmail} disabled={loading || !newEmail} className="w-full sm:w-auto h-11 px-6">
                    {language === "fr" ? "Modifier" : "Update"}
                  </Button>
                </div>
              </div>

              {/* Update password */}
              <div className="space-y-3">
                <Label htmlFor="new-password" className="flex items-center gap-2 text-base font-semibold">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
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
                    className="flex-1 h-11"
                  />
                  <Button onClick={handleUpdatePassword} disabled={loading || !newPassword} className="w-full sm:w-auto h-11 px-6">
                    {language === "fr" ? "Modifier" : "Update"}
                  </Button>
                </div>
              </div>

              {/* Sign out button */}
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full h-12 text-base font-semibold"
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
                className="w-full h-12 text-base font-semibold"
                onClick={handleSignIn}
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t.signIn}
              </Button>
              <Button 
                className="w-full h-12 text-base font-semibold"
                onClick={handleSignUp}
              >
                {t.createAccount}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
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
