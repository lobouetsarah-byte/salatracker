import { useEffect, useState } from "react";
import salatrackLogo from "@/assets/salatrack-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Wait for fade out animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-pulse"></div>
        <img 
          src={salatrackLogo} 
          alt="Salatracker" 
          className="relative w-40 h-40 rounded-3xl shadow-2xl bg-white p-4 animate-scale-in" 
        />
      </div>
      <h1 className="mt-6 text-4xl font-bold text-primary drop-shadow-lg">
        Salatracker
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">Suivez vos prières au quotidien</p>
    </div>
  );
};
