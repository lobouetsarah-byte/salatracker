import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save } from "lucide-react";
import { useLocationSettings } from "@/hooks/useLocationSettings";
import { toast } from "sonner";

interface LocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LocationDialog = ({ open, onOpenChange }: LocationDialogProps) => {
  const { settings, setAutoMode, setManualMode, isManualMode } = useLocationSettings();
  const [city, setCity] = useState(settings.manualLocation?.city || "");
  const [latitude, setLatitude] = useState(settings.manualLocation?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(settings.manualLocation?.longitude?.toString() || "");
  const [useCoordinates, setUseCoordinates] = useState(false);
  const [localManualMode, setLocalManualMode] = useState(isManualMode);
  const DEFAULT_COUNTRY = "France";

  const handleToggleMode = (checked: boolean) => {
    setLocalManualMode(checked);
    if (!checked) {
      setAutoMode();
      toast.success("Mode automatique activé", { duration: 3000 });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleSaveManualLocation = () => {
    if (useCoordinates) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lon)) {
        toast.error("Veuillez entrer des coordonnées valides", { duration: 3000 });
        return;
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        toast.error("Coordonnées hors limites", { duration: 3000 });
        return;
      }

      setManualMode({ latitude: lat, longitude: lon });
      toast.success("Localisation manuelle enregistrée", { duration: 3000 });
    } else {
      if (!city.trim()) {
        toast.error("Veuillez entrer une ville", { duration: 3000 });
        return;
      }

      setManualMode({ city: city.trim(), country: DEFAULT_COUNTRY });
      toast.success(`Localisation enregistrée: ${city}, ${DEFAULT_COUNTRY}`, { duration: 3000 });
    }
    
    onOpenChange(false);
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localisation
          </DialogTitle>
          <DialogDescription>
            Configurez votre localisation pour les horaires de prière
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Auto/Manual Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="manual-location">Localisation manuelle</Label>
              <p className="text-xs text-muted-foreground">
                Désactiver la détection automatique
              </p>
            </div>
            <Switch
              id="manual-location"
              checked={localManualMode}
              onCheckedChange={handleToggleMode}
            />
          </div>

          {/* Manual Location Input */}
          {localManualMode && (
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="use-coordinates">Utiliser coordonnées</Label>
                <Switch
                  id="use-coordinates"
                  checked={useCoordinates}
                  onCheckedChange={setUseCoordinates}
                />
              </div>

              {useCoordinates ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="ex: 48.8566"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="ex: 2.3522"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="city">Ville en France</Label>
                  <Input
                    id="city"
                    placeholder="ex: Paris, Lyon, Marseille..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              )}

              <Button onClick={handleSaveManualLocation} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          )}

          {/* Current Location Info */}
          {!localManualMode && (
            <div className="text-xs text-muted-foreground border-t pt-4">
              <p className="font-medium mb-1">Mode automatique actif</p>
              <p>Les horaires sont calculés selon votre position GPS</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
