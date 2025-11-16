import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Bell, Award, Wifi, BookOpen, Heart, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";

const HowItWorks = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      icon: CheckCircle2,
      title: "Suivre vos prières",
      description: "Marquez chaque prière comme accomplie à l'heure, en retard, ou manquée. Un simple clic pour rester organisé.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Clock,
      title: "Horaires automatiques",
      description: "Les horaires sont calculés selon votre localisation. L'heure de la prochaine prière est toujours visible en un coup d'œil.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: BookOpen,
      title: "Adhkar matin & soir",
      description: "Récitez vos invocations quotidiennes avec l'arabe, la phonétique et la traduction. Suivez votre progression.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Heart,
      title: "Mode indisposée",
      description: "Un mode spécial pendant vos périodes pour suivre vos actes spirituels : dhikr, invocations et rappels à chaque moment de prière.",
      color: "text-[#E91E63]",
      bgColor: "bg-[#E91E63]/10"
    },
    {
      icon: Award,
      title: "Badges & récompenses",
      description: "Gagnez des badges pour votre assiduité : 7 jours consécutifs, journée parfaite, mois discipliné et plus encore.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Bell,
      title: "Notifications intelligentes",
      description: "Recevez l'adhan à l'heure exacte, un rappel 30 min avant la prochaine prière, et des rappels pour vos adhkar.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Wifi,
      title: "Mode hors-ligne & Widget",
      description: "L'app fonctionne sans connexion. Vos données se synchronisent automatiquement. Widget iPhone pour un accès rapide.",
      color: "text-accent",
      bgColor: "bg-accent/10"
    }
  ];

  const totalPages = pages.length;
  const currentPageData = pages[currentPage];

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      navigate("/");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <div className="container max-w-2xl mx-auto px-4 h-full flex flex-col justify-between py-6 sm:py-8">
        {/* Header - Compact */}
        <div className="text-center flex-shrink-0">
          <img 
            src={salatrackLogo} 
            alt="Salatrack Logo" 
            className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 drop-shadow-lg animate-fade-in"
          />
          <h1 className="text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Comment ça marche ?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Découvrez Salatrack en quelques étapes
          </p>
        </div>

        {/* Progress Indicators - Compact */}
        <div className="flex justify-center gap-2 my-4 sm:my-6 flex-shrink-0">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentPage 
                  ? "w-6 bg-primary" 
                  : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Aller à la page ${index + 1}`}
            />
          ))}
        </div>

        {/* Main Content Card - Flex grow to take available space */}
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur shadow-lg animate-fade-in overflow-hidden min-h-0">
          <CardContent className="p-6 sm:p-8 flex flex-col items-center justify-center text-center h-full">
            <div className={`p-4 sm:p-5 rounded-2xl ${currentPageData.bgColor} mb-4 sm:mb-5 animate-scale-in flex-shrink-0`}>
              <currentPageData.icon className={`w-12 h-12 sm:w-14 sm:h-14 ${currentPageData.color}`} />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 animate-fade-in flex-shrink-0">
              {currentPageData.title}
            </h2>
            
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md animate-fade-in">
              {currentPageData.description}
            </p>
          </CardContent>
        </Card>

        {/* Navigation Buttons - Compact */}
        <div className="flex items-center justify-between gap-4 mt-4 sm:mt-6 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour
          </Button>

          {currentPage < totalPages - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground text-xs"
            >
              Passer
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleNext}
            className="flex-shrink-0 shadow-lg"
          >
            {currentPage === totalPages - 1 ? (
              <>
                Commencer
                <CheckCircle2 className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Page Counter - Compact */}
        <p className="text-center text-xs text-muted-foreground mt-3 flex-shrink-0">
          {currentPage + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
