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
  timeoutDuration = 10000 // 10 seconds max
}: SplashScreenProps) => {
  const [showError, setShowError] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [timeoutTriggered, setTimeoutTriggered] = useState(false);

  // Handle exit animation when ready
  useEffect(() => {
    if (isReady && !showError) {
      setIsExiting(true);
    }
  }, [isReady, showError]);

  // Timeout handling
  useEffect(() => {
    if (isReady || timeoutTriggered) return;

    const timer = setTimeout(() => {
      if (!isReady) {
        setTimeoutTriggered(true);
        setShowError(true);
        onTimeout?.();
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [isReady, timeoutDuration, onTimeout, timeoutTriggered]);

  const handleReload = () => {
    window.location.reload();
  };

  // Exit animation (fade out and slide up)
  if (isExiting) {
    return (
      <div
        className="fixed inset-0 bg-white dark:bg-white z-[100] flex items-center justify-center transition-all duration-700 ease-out opacity-0 -translate-y-4 pointer-events-none"
        style={{
          animation: 'splash-exit 700ms ease-out forwards'
        }}
      >
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl"></div>
              <div className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10">
                <img
                  src={salatrackLogo}
                  alt="Salatracker"
                  className="w-24 h-24 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-primary/5 to-accent/5 dark:from-white dark:via-primary/5 dark:to-accent/5 z-[100] flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        {showError ? (
          // Error state
          <Card
            className="p-8 space-y-6 shadow-2xl border-2 border-destructive/20 animate-scale-in"
            style={{ animation: 'scale-in 400ms ease-out' }}
          >
            <div className="flex items-center justify-center">
              <div className="p-4 rounded-2xl bg-destructive/10 animate-pulse">
                <AlertCircle className="w-16 h-16 text-destructive" />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Le chargement prend plus de temps que prévu
              </h1>
              <p className="text-muted-foreground">
                Vérifiez votre connexion internet ou réessayez.
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
          // Loading state with animations
          <div
            className="text-center space-y-8"
            style={{ animation: 'fade-in 600ms ease-out' }}
          >
            {/* Logo with scale-in and glow effect */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div
                  className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl"
                  style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}
                ></div>

                {/* Logo container */}
                <div
                  className="relative p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-2xl"
                  style={{ animation: 'scale-in 600ms ease-out' }}
                >
                  <img
                    src={salatrackLogo}
                    alt="Salatracker"
                    className="w-28 h-28 drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>

            {/* Title with gradient and fade-in */}
            <div
              className="space-y-3"
              style={{ animation: 'fade-in 800ms ease-out 200ms both' }}
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Salatracker
              </h1>
              <p className="text-lg text-muted-foreground font-medium">
                Votre compagnon pour les prières quotidiennes
              </p>
            </div>

            {/* Loading dots */}
            <div
              className="flex items-center justify-center space-x-2 pt-4"
              style={{ animation: 'fade-in 1000ms ease-out 400ms both' }}
            >
              <div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: 'bounce-dot 1.4s ease-in-out infinite' }}
              ></div>
              <div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: 'bounce-dot 1.4s ease-in-out 0.2s infinite' }}
              ></div>
              <div
                className="w-2.5 h-2.5 bg-primary rounded-full"
                style={{ animation: 'bounce-dot 1.4s ease-in-out 0.4s infinite' }}
              ></div>
            </div>

            {/* Progress bar */}
            <div
              className="pt-8"
              style={{ animation: 'fade-in 1200ms ease-out 600ms both' }}
            >
              <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full"
                  style={{ animation: 'progress-bar 2s ease-in-out infinite' }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes splash-exit {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-20px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }

        @keyframes bounce-dot {
          0%, 80%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1.2) translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes progress-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};
