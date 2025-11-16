import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Bell, Award, Wifi, Smartphone, BookOpen, Heart, Clock, ArrowRight, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <div className="container max-w-2xl mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src={salatrackLogo} 
            alt="Salatrack Logo" 
            className="w-16 h-16 mx-auto mb-4 drop-shadow-lg animate-fade-in"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Comment ça marche ?
          </h1>
          <p className="text-sm text-muted-foreground">
            Découvrez Salatrack en quelques étapes
          </p>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentPage 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Aller à la page ${index + 1}`}
            />
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="flex-1 border-border/50 bg-card/50 backdrop-blur shadow-lg animate-fade-in">
          <CardContent className="p-8 sm:p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
            <div className={`p-6 rounded-2xl ${currentPageData.bgColor} mb-6 animate-scale-in`}>
              <currentPageData.icon className={`w-16 h-16 ${currentPageData.color}`} />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 animate-fade-in">
              {currentPageData.title}
            </h2>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-md animate-fade-in">
              {currentPageData.description}
            </p>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>

          {currentPage < totalPages - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Passer
            </Button>
          )}

          <Button
            size="lg"
            onClick={handleNext}
            className="flex-shrink-0 shadow-lg"
          >
            {currentPage === totalPages - 1 ? (
              <>
                Commencer
                <CheckCircle2 className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Page Counter */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {currentPage + 1} / {totalPages}
        </p>
      </div>
    </div>
  );
};

export default HowItWorks;
