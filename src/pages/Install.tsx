import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Check, Smartphone, Home } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import salatrackLogo from "@/assets/salatrack-logo.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Install = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const features = [
    {
      icon: Smartphone,
      title: language === "fr" ? "Accès rapide" : "Quick access",
      description: language === "fr" 
        ? "Lancez l'app directement depuis votre écran d'accueil"
        : "Launch app directly from your home screen"
    },
    {
      icon: Download,
      title: language === "fr" ? "Fonctionne hors ligne" : "Works offline",
      description: language === "fr"
        ? "Utilisez Salatrack même sans connexion internet"
        : "Use Salatrack even without internet"
    },
    {
      icon: Check,
      title: language === "fr" ? "Notifications" : "Notifications",
      description: language === "fr"
        ? "Recevez des rappels pour vos prières"
        : "Get reminders for your prayers"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img src={salatrackLogo} alt="Salatrack" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">
            {language === "fr" ? "Installer Salatrack" : "Install Salatrack"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {language === "fr" 
              ? "Profitez d'une expérience optimale sur mobile"
              : "Enjoy an optimal mobile experience"}
          </p>
        </div>

        <Card className="shadow-xl mb-6">
          <CardHeader className="text-center">
            {isInstalled ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl">
                  {language === "fr" ? "Application installée !" : "App installed!"}
                </CardTitle>
                <CardDescription>
                  {language === "fr"
                    ? "Vous pouvez maintenant utiliser Salatrack depuis votre écran d'accueil"
                    : "You can now use Salatrack from your home screen"}
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl">
                  {language === "fr" ? "Installez l'application" : "Install the app"}
                </CardTitle>
                <CardDescription>
                  {language === "fr"
                    ? "En un clic, ajoutez Salatrack à votre appareil"
                    : "Add Salatrack to your device in one click"}
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              {!isInstalled && deferredPrompt && (
                <Button onClick={handleInstall} className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  {language === "fr" ? "Installer maintenant" : "Install now"}
                </Button>
              )}
              
              {!deferredPrompt && !isInstalled && (
                <div className="p-4 rounded-lg bg-muted text-center">
                  <p className="text-sm text-muted-foreground">
                    {language === "fr"
                      ? "Pour installer sur iOS : Appuyez sur le bouton Partager puis 'Sur l'écran d'accueil'"
                      : "To install on iOS: Tap the Share button then 'Add to Home Screen'"}
                  </p>
                </div>
              )}

              <Button 
                onClick={() => navigate("/")} 
                variant="outline" 
                className="w-full" 
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                {language === "fr" ? "Retour à l'accueil" : "Back to home"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          {language === "fr"
            ? "L'installation est optionnelle. Vous pouvez continuer à utiliser Salatrack dans votre navigateur."
            : "Installation is optional. You can continue using Salatrack in your browser."}
        </p>
      </div>
    </div>
  );
};

export default Install;
