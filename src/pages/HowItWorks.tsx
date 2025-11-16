import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Bell, Award, Wifi, Smartphone, BookOpen, Heart, Clock } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";

const HowItWorks = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle2,
      title: "Marquer vos prières",
      description: "Cochez vos prières comme accomplies à l'heure, en retard, ou manquées. Suivez votre dhikr après chaque prière."
    },
    {
      icon: Clock,
      title: "Horaires de prières",
      description: "Les horaires sont calculés automatiquement selon votre localisation. L'heure de la prochaine prière est toujours visible."
    },
    {
      icon: BookOpen,
      title: "Adhkar matin & soir",
      description: "Récitez vos invocations du matin et du soir avec l'arabe, la phonétique et la traduction. Suivez votre progression quotidienne."
    },
    {
      icon: Heart,
      title: "Mode indisposée",
      description: "Activez le mode spécial pendant vos périodes. Suivez vos actes spirituels (dhikr, invocations, rappels) à chaque moment de prière."
    },
    {
      icon: Award,
      title: "Badges & récompenses",
      description: "Gagnez des badges pour votre assiduité : 7 jours consécutifs, journée parfaite, mois discipliné, et bien plus encore."
    },
    {
      icon: Wifi,
      title: "Mode hors-ligne",
      description: "L'application fonctionne sans connexion internet. Vos données se synchronisent automatiquement quand vous êtes en ligne."
    },
    {
      icon: Bell,
      title: "Notifications intelligentes",
      description: "Recevez l'adhan à l'heure exacte de chaque prière, un rappel 30 min avant la suivante, et des rappels pour vos adhkar."
    },
    {
      icon: Smartphone,
      title: "Widget iPhone",
      description: "Accès rapide depuis votre écran d'accueil : visualisez la prochaine prière et marquez-la comme accomplie en un clic."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <img 
            src={salatrackLogo} 
            alt="Salatrack Logo" 
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 drop-shadow-lg"
          />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Comment ça marche ?
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Découvrez toutes les fonctionnalités de Salatrack pour vous accompagner dans votre cheminement spirituel
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base sm:text-lg mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Additional Info Card */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 sm:gap-4">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2 text-base sm:text-lg">Hadith de la semaine</h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Chaque semaine, découvrez un nouveau hadith avec sa traduction française pour enrichir votre connaissance et votre foi.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            size="lg"
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Commencer maintenant
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Prêt à transformer votre pratique spirituelle ? 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
