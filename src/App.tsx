import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SplashScreen } from "@/components/SplashScreen";
import { SupabaseConfigError } from "@/components/SupabaseConfigError";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import { useSwipeBack } from "@/hooks/useSwipeBack";
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
  const { initialized, loading } = useAuth();
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [appReady, setAppReady] = useState(false);
  const [initError, setInitError] = useState(false);

  useSwipeBack();

  useEffect(() => {
    const minSplashTime = 2500; // Minimum 2.5 seconds
    const splashStartTime = Date.now();

    if (initialized) {
      setAppReady(true);

      const elapsedTime = Date.now() - splashStartTime;
      const remainingTime = Math.max(0, minSplashTime - elapsedTime);

      const timer = setTimeout(() => {
        setShowSplash(false);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [initialized]);

  useEffect(() => {
    const errorTimer = setTimeout(() => {
      if (!initialized && !loading) {
        setInitError(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(errorTimer);
  }, [initialized, loading]);

  if (!initialized || showSplash) {
    return (
      <SplashScreen
        isReady={appReady}
        timeoutDuration={30000}
      />
    );
  }

  return (
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
  );
};

const App = () => {
  if (!isSupabaseConfigured()) {
    return <SupabaseConfigError />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
};

export default App;
