import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, MapPin, Bell } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

export const SettingsPermissions = () => {
  const { language } = useLanguage();

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location permission granted:', position);
        },
        (error) => {
          console.error('Location permission denied:', error);
        }
      );
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {language === "fr" ? "Autorisations" : "Permissions"}
        </CardTitle>
        <CardDescription>
          {language === "fr" 
            ? "Gérez les autorisations de l'application" 
            : "Manage app permissions"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1 flex-1">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Bell className="w-4 h-4 text-primary" />
              {language === "fr" ? "Notifications" : "Notifications"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {language === "fr" 
                ? "Autorisez l'application à vous envoyer des notifications" 
                : "Allow the app to send you notifications"
              }
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={requestNotificationPermission}
          >
            {language === "fr" ? "Activer" : "Enable"}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg border">
          <div className="space-y-1 flex-1">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <MapPin className="w-4 h-4 text-primary" />
              {language === "fr" ? "Localisation" : "Location"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {language === "fr" 
                ? "Utilisée pour calculer les horaires de prière précis" 
                : "Used to calculate accurate prayer times"
              }
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={requestLocationPermission}
          >
            {language === "fr" ? "Activer" : "Enable"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
