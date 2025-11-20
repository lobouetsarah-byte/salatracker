import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function GenerateSplash() {
  const [loading, setLoading] = useState(false);
  const [normalImage, setNormalImage] = useState<string | null>(null);
  const [periodImage, setPeriodImage] = useState<string | null>(null);
  const { toast } = useToast();

  const generateSplashScreen = async (mode: 'normal' | 'period') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-splash-screen', {
        body: { mode }
      });

      if (error) throw error;

      if (data.success) {
        if (mode === 'normal') {
          setNormalImage(data.imageUrl);
        } else {
          setPeriodImage(data.imageUrl);
        }
        toast({
          title: "Succès",
          description: `Splash screen ${mode === 'normal' ? 'normal' : 'indisposée'} généré`,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le splash screen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Générateur de Splash Screen</h1>
          <p className="text-muted-foreground">
            Génère les splash screens pour l'application native
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Normal Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Mode Normal</CardTitle>
              <CardDescription>
                Splash screen avec fond clair (#F7F8FA)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => generateSplashScreen('normal')}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer"
                )}
              </Button>

              {normalImage && (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <img 
                      src={normalImage} 
                      alt="Splash Normal" 
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    onClick={() => downloadImage(normalImage, 'splash-normal.png')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Period Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Mode Indisposée</CardTitle>
              <CardDescription>
                Splash screen avec fond rose (#FFF5F9)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => generateSplashScreen('period')}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  "Générer"
                )}
              </Button>

              {periodImage && (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <img 
                      src={periodImage} 
                      alt="Splash Period" 
                      className="w-full h-auto"
                    />
                  </div>
                  <Button
                    onClick={() => downloadImage(periodImage, 'splash-period.png')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Cliquez sur "Générer" pour créer le splash screen</p>
            <p>2. L'image sera générée avec l'IA Lovable</p>
            <p>3. Téléchargez l'image en cliquant sur "Télécharger"</p>
            <p>4. Utilisez l'image dans votre application native Capacitor</p>
            <p className="mt-4 font-medium text-foreground">
              Couleurs utilisées:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Mode normal: Background #F7F8FA, Texte #1E40AF</li>
              <li>Mode indisposée: Background #FFF5F9, Texte #8B3A62</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
