import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SplashScreen } from "@/components/SplashScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import HowItWorks from "./pages/HowItWorks";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GenerateSplash from "./pages/GenerateSplash";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Only show splash screen once on initial homepage load
    if (!loading && location.pathname === "/" && !hasShownSplash) {
      setShowSplash(true);
      setHasShownSplash(true);

      const readyTimer = setTimeout(() => {
        setAppReady(true);
      }, 1000);

      const hideTimer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);

      return () => {
        clearTimeout(readyTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [loading, location.pathname, hasShownSplash]);

  return (
    <>
      {showSplash && location.pathname === "/" && (
        <SplashScreen
          isReady={appReady}
          timeoutDuration={8000}
        />
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/generate-splash" element={<GenerateSplash />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
