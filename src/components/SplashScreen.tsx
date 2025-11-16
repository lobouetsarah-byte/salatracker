import { useEffect, useState } from "react";
import salatrackLogo from "@/assets/salatrack-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInPeriod, setIsInPeriod] = useState(false);

  // Check period mode status
  useEffect(() => {
    const checkPeriodMode = () => {
      const periodMode = localStorage.getItem("period-mode") === "true";
      setIsInPeriod(periodMode);
    };
    
    checkPeriodMode();
    window.addEventListener("period-mode-changed", checkPeriodMode);
    
    return () => window.removeEventListener("period-mode-changed", checkPeriodMode);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${isInPeriod ? "bg-gradient-to-br from-[#E91E63] to-[#FF6B9D]" : "bg-white dark:bg-white"}`}
    >
      <div className="relative">
        <img 
          src={salatrackLogo} 
          alt="Salatracker" 
          className="w-40 h-40 animate-scale-in" 
        />
      </div>
      <h1 className={`mt-6 text-4xl font-bold drop-shadow-lg animate-fade-in ${
        isInPeriod ? "text-white" : "text-primary"
      }`}>
        Salatracker
      </h1>
      <p className={`mt-2 text-sm animate-fade-in ${
        isInPeriod ? "text-white/90" : "text-muted-foreground"
      }`}>
        Suivez vos prières au quotidien
      </p>
    </div>
  );
};
