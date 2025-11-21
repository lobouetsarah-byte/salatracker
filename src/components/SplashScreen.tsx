import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { RefreshCw, AlertCircle } from "lucide-react";

interface SplashScreenProps {
  isReady: boolean;
  onTimeout?: () => void;
  timeoutDuration?: number;
}

export const SplashScreen = ({
  isReady,
  onTimeout,
  timeoutDuration = 10000
}: SplashScreenProps) => {
  const [showError, setShowError] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isReady) {
      setFadeOut(true);
    }
  }, [isReady]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isReady) {
        setShowError(true);
        onTimeout?.();
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [isReady, timeoutDuration, onTimeout]);

  const handleReload = () => {
    window.location.reload();
  };

  if (fadeOut) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-white z-[100] flex items-center justify-center transition-opacity duration-500 opacity-0 pointer-events-none">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-primary/10">
              <img
                src={salatrackLogo}
                alt="Salatracker"
                className="w-24 h-24 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white dark:bg-white z-[100] flex items-center justify-center transition-opacity duration-500">
      <div className="w-full max-w-md px-6">
        {showError ? (
          <Card className="p-8 space-y-6 shadow-2xl border-2 border-destructive/20">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-2xl bg-destructive/10">
                <AlertCircle className="w-16 h-16 text-destructive" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Chargement trop long
              </h1>
              <p className="text-muted-foreground">
                L'application met plus de temps que prévu à se charger. Vérifiez votre connexion internet ou réessayez.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleReload}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Recharger l'application
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Si le problème persiste, contactez le support
              </p>
            </div>
          </Card>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-2xl bg-primary/10 animate-pulse">
                <img
                  src={salatrackLogo}
                  alt="Salatracker"
                  className="w-24 h-24 drop-shadow-lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Salatracker
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Votre compagnon pour les prières quotidiennes
              </p>
            </div>

            <div className="flex items-center justify-center space-x-2 pt-4">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>

            <div className="pt-8">
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent animate-progress-bar"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
