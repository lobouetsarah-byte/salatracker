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
      <div className="relative w-40 h-40 rounded-3xl shadow-2xl bg-white p-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Simulating beads appearing one by one with staggered animation */}
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_0.2s_forwards]">
              <div className="w-3 h-3 bg-primary rounded-full absolute top-[20%] left-[15%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_0.4s_forwards]">
              <div className="w-4 h-4 bg-primary rounded-full absolute top-[30%] left-[25%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_0.6s_forwards]">
              <div className="w-6 h-6 bg-primary rounded-full absolute top-[45%] left-[20%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_0.8s_forwards]">
              <div className="w-7 h-7 bg-accent rounded-full absolute bottom-[25%] left-[35%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_1s_forwards]">
              <div className="w-5 h-5 bg-accent rounded-full absolute bottom-[20%] right-[30%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_1.2s_forwards]">
              <div className="w-4 h-4 bg-primary rounded-full absolute top-[35%] right-[25%]"></div>
            </div>
            <div className="absolute inset-0 opacity-0 animate-[fadeIn_0.4s_ease-out_1.4s_forwards]">
              <div className="w-3 h-3 bg-primary rounded-full absolute top-[25%] right-[15%]"></div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="mt-6 text-4xl font-bold text-primary drop-shadow-lg">
        Salatracker
      </h1>
      <p className="mt-2 text-muted-foreground text-sm">Suivez vos prières au quotidien</p>
    </div>
  );
};
