import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Save } from "lucide-react";
import { useLocationSettings } from "@/hooks/useLocationSettings";
import { toast } from "sonner";

export const LocationSettings = () => {
  const { settings, setAutoMode, setManualMode, isManualMode } = useLocationSettings();
  const [city, setCity] = useState(settings.manualLocation?.city || "");
  const [country, setCountry] = useState(settings.manualLocation?.country || "");
  const [latitude, setLatitude] = useState(settings.manualLocation?.latitude?.toString() || "");
  const [longitude, setLongitude] = useState(settings.manualLocation?.longitude?.toString() || "");
  const [useCoordinates, setUseCoordinates] = useState(false);

  const handleToggleMode = (checked: boolean) => {
    if (!checked) {
      setAutoMode();
      toast.success("Switched to automatic location");
    }
  };

  const handleSaveManualLocation = () => {
    if (useCoordinates) {
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      
      if (isNaN(lat) || isNaN(lon)) {
        toast.error("Please enter valid coordinates");
        return;
      }

      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        toast.error("Coordinates out of range");
        return;
      }

      setManualMode({ latitude: lat, longitude: lon });
      toast.success("Manual location saved with coordinates");
    } else {
      if (!city.trim() || !country.trim()) {
        toast.error("Please enter both city and country");
        return;
      }

      setManualMode({ city: city.trim(), country: country.trim() });
      toast.success(`Manual location saved: ${city}, ${country}`);
    }
    
    // Reload to fetch new prayer times
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Settings
        </CardTitle>
        <CardDescription>
          Configure how prayer times are calculated based on your location
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto/Manual Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="manual-location">Manual Location</Label>
            <p className="text-sm text-muted-foreground">
              Override automatic location detection
            </p>
          </div>
          <Switch
            id="manual-location"
            checked={isManualMode}
            onCheckedChange={handleToggleMode}
          />
        </div>

        {/* Manual Location Input */}
        {isManualMode && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-coordinates">Use Coordinates</Label>
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
                    placeholder="e.g., 48.8566"
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
                    placeholder="e.g., 2.3522"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Paris"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., France"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
              </>
            )}

            <Button onClick={handleSaveManualLocation} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save Location
            </Button>
          </div>
        )}

        {/* Current Location Info */}
        {!isManualMode && (
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p className="font-medium mb-1">Using automatic location</p>
            <p>Prayer times will be calculated based on your device's GPS location</p>
          </div>
        )}

        {isManualMode && settings.manualLocation && (
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p className="font-medium mb-1">Manual location active</p>
            {settings.manualLocation.city && settings.manualLocation.country ? (
              <p>{settings.manualLocation.city}, {settings.manualLocation.country}</p>
            ) : (
              <p>
                Coordinates: {settings.manualLocation.latitude?.toFixed(4)}, {settings.manualLocation.longitude?.toFixed(4)}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
