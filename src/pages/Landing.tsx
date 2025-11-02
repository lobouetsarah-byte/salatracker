import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, BarChart3, BookOpen, Bell, Globe, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/salatrack-logo.png";
import appScreenshot from "@/assets/app-screenshot.png";

export default function Landing() {
  const features = [
    {
      icon: CheckCircle,
      title: "Suivi des Prières",
      description: "Suivez vos 5 prières quotidiennes avec une interface intuitive et élégante"
    },
    {
      icon: BookOpen,
      title: "Adhkar Matin & Soir",
      description: "Adhkar authentiques avec audio, traductions et phonétique pour vous accompagner"
    },
    {
      icon: BarChart3,
      title: "Statistiques Détaillées",
      description: "Visualisez votre assiduité avec des graphiques hebdomadaires et mensuels"
    },
    {
      icon: Bell,
      title: "Notifications Intelligentes",
      description: "Rappels pour chaque prière et pour les adhkar matin/soir"
    },
    {
      icon: Globe,
      title: "Multi-Langues",
      description: "Interface disponible en français et anglais, contenus arabes authentiques"
    },
    {
      icon: Shield,
      title: "Données Sécurisées",
      description: "Vos données sont synchronisées en toute sécurité dans le cloud"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary/95 to-primary/90">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Salatrack" className="h-10 w-auto" />
              <span className="text-xl font-bold text-white">Salatrack</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Connexion
                </Button>
              </Link>
              <Link to="/onboarding">
                <Button className="bg-white text-primary hover:bg-white/90">
                  Commencer Gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Fiable pour les musulmans du monde entier
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Suivez Vos Prières
              <br />
              <span className="bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Facilement
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Ne manquez plus jamais une prière avec notre application complète incluant 
              les adhkar matin & soir, les statistiques et bien plus encore
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/onboarding">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6 h-auto">
                  En Savoir Plus
                </Button>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Données Sécurisées</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>Adhkar Authentiques</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Screenshot */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
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
      <section id="features" className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-muted-foreground">
              Une application complète pour maintenir votre routine de prière et renforcer votre foi
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-primary/10 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Pourquoi choisir Salatrack ?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Adhkar Complets</h3>
                    <p className="text-muted-foreground">
                      Invocations du matin et du soir avec audio, traductions et phonétique
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Statistiques Avancées</h3>
                    <p className="text-muted-foreground">
                      Visualisez votre assiduité avec des graphiques détaillés semaine par semaine
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Interface Élégante</h3>
                    <p className="text-muted-foreground">
                      Design moderne et épuré qui rend le suivi des prières agréable
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">Synchronisation Cloud</h3>
                    <p className="text-muted-foreground">
                      Vos données sont sauvegardées automatiquement et accessibles partout
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl"></div>
              <Card className="relative shadow-2xl border-primary/20">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
                      <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <div className="text-5xl font-bold text-primary mb-2">100%</div>
                      <p className="text-xl font-semibold">Gratuit</p>
                    </div>
                    <p className="text-muted-foreground">
                      Toutes les fonctionnalités sont gratuites, sans publicité ni abonnement
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Commencez votre voyage spirituel aujourd'hui
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Rejoignez des milliers de musulmans qui améliorent leur assiduité dans la prière
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/onboarding">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 h-auto">
                Créer mon compte gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-6 h-auto">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-primary border-t border-white/10">
        <div className="container mx-auto text-center text-white/70">
          <div className="flex justify-center gap-8 mb-4 text-sm">
            <Link to="/terms" className="hover:text-white transition-colors">
              Conditions Générales
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
          </div>
          <p className="text-sm">
            © 2024 Salatrack. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
