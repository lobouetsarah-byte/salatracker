import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BarChart3, BookOpen, Bell, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/salatrack-logo.png";
import appScreenshot from "@/assets/app-screenshot.png";
import { useAuth } from "@/contexts/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Clock,
      title: "Rappel 30min Avant",
      description: "Notification automatique 30 minutes avant chaque prière si la précédente n'est pas cochée",
      highlight: true
    },
    {
      icon: CheckCircle,
      title: "Suivi des 5 Prières",
      description: "Interface simple et élégante pour cocher vos prières quotidiennes"
    },
    {
      icon: BookOpen,
      title: "Adhkar Complets",
      description: "Invocations du matin et du soir avec audio, traductions et phonétique"
    },
    {
      icon: BarChart3,
      title: "Statistiques",
      description: "Graphiques hebdomadaires pour suivre votre assiduité"
    },
    {
      icon: Bell,
      title: "Rappels Prières",
      description: "Notifications à l'heure exacte de chaque prière"
    },
    {
      icon: Sparkles,
      title: "Synchronisation Cloud",
      description: "Vos données sauvegardées automatiquement et accessibles partout"
    }
  ];

  const handleGetStarted = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src={logo} alt="Salatrack" className="h-8 sm:h-10 w-auto" />
              <span className="text-lg sm:text-xl font-bold text-white">Salatrack</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {user ? (
                <Button 
                  onClick={() => navigate("/app")} 
                  className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base"
                >
                  Ouvrir l'App
                </Button>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:block">
                    <Button variant="ghost" className="text-white hover:bg-white/10">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/onboarding">
                    <Button className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base">
                      Commencer
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 inline" />
              Fiable pour les musulmans du monde entier
            </Badge>
            
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
              Ne Manquez Plus
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Aucune Prière
              </span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4">
              Rappels automatiques 30 minutes avant chaque prière + Adhkar complets + Statistiques
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/app")}
                  className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale"
                >
                  Ouvrir l'App
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale"
                >
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
              <a href="#features">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto w-full sm:w-auto">
                  Découvrir
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-6 sm:pt-8 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Rappel 30min</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Adhkar Audio</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshot */}
      <section className="pb-12 sm:pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto animate-scale-in">
            <Card className="overflow-hidden shadow-2xl border-white/20 bg-white/10 backdrop-blur-lg">
              <CardContent className="p-0">
                <img 
                  src={appScreenshot} 
                  alt="Aperçu de l'application Salatrack" 
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Fonctionnalités
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground">
              Tout pour maintenir votre routine de prière
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`border-primary/10 hover:shadow-lg transition-all duration-300 hover-scale ${
                  feature.highlight ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className={`p-2.5 sm:p-3 rounded-lg ${
                    feature.highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  } w-fit mb-3 sm:mb-4`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {feature.title}
                    {feature.highlight && (
                      <Badge className="ml-2 bg-primary text-xs">★</Badge>
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Simplified */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="shadow-2xl border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-6 sm:p-10">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 mb-4 sm:mb-6">
                <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                100% Gratuit
              </h2>
              <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                Toutes les fonctionnalités sans publicité ni abonnement. Simple, efficace, authentique.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto text-left mb-6 sm:mb-8">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Adhkar avec audio</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Statistiques visuelles</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Synchronisation cloud</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base">Interface intuitive</span>
                </div>
              </div>
              {user ? (
                <Button 
                  size="lg" 
                  onClick={() => navigate("/app")}
                  className="bg-primary text-white hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale"
                >
                  Ouvrir l'Application
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-primary text-white hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale"
                >
                  Commencer Maintenant
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Commencez Maintenant
          </h2>
          <p className="text-base sm:text-xl mb-6 sm:mb-8 text-white/90">
            Gratuit · Sans publicité · Authentique
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => navigate("/app")}
                className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale w-full"
              >
                Ouvrir l'Application
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            ) : (
              <>
                <Link to="/onboarding" className="flex-1">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto hover-scale w-full">
                    Créer mon compte
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Link to="/auth" className="flex-1">
                  <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto w-full">
                    Connexion
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 bg-primary border-t border-white/10">
        <div className="container mx-auto text-center text-white/70">
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-3 sm:mb-4 text-xs sm:text-sm">
            <Link to="/terms" className="hover:text-white transition-colors">
              Conditions Générales
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
          <p className="text-xs sm:text-sm">
            © 2024 Salatrack. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
