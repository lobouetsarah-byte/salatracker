import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export const NotificationPermissionPrompt = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Wait for splash to be dismissed before checking permissions
  useEffect(() => {
    // Wait 3 seconds to ensure splash is fully dismissed
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (typeof window === "undefined") return;

    const canNotify = "Notification" in window;
    if (!canNotify) return;

    const permission = Notification.permission;
    setShouldShow(permission === "default");
  }, [isReady]);

  if (!shouldShow) return null;

  const requestPermission = async () => {
    try {
      const res = await Notification.requestPermission();
      if (res !== "granted") {
        // keep banner visible so user can try again
        return;
      }
      setShouldShow(false);
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
  };

  return (
    <div
      className="rounded-lg border border-border bg-card/70 backdrop-blur p-4 flex items-start justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500"
    >
      <div className="text-sm">
        <p className="font-medium text-foreground mb-1">Activer les notifications</p>
        <p className="text-muted-foreground">
          Autorisez les notifications pour recevoir l'adhan à l'heure et un rappel 30 min avant la prochaine prière.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={requestPermission}>Autoriser</Button>
        <Button size="sm" variant="ghost" onClick={() => setShouldShow(false)}>Plus tard</Button>
      </div>
    </div>
  );
};
