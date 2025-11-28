import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Context to provide splash state to child components
export const SplashContext = React.createContext<{ isSplashDismissed: boolean }>({
  isSplashDismissed: false,
});

const AppContent = () => {
  const { initialized, loading } = useAuth();
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasSplashMinimumTimeElapsed, setHasSplashMinimumTimeElapsed] = useState(false);
  const [isSplashDismissed, setIsSplashDismissed] = useState(false);

  useSwipeBack();

  // Minimum splash duration (2.5 seconds)
  useEffect(() => {
    const MINIMUM_SPLASH_DURATION = 2500; // 2.5 seconds
    const timer = setTimeout(() => {
      setHasSplashMinimumTimeElapsed(true);
    }, MINIMUM_SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Check if app is ready (auth initialized)
  useEffect(() => {
    if (initialized && !loading) {
      setIsAppReady(true);
    }
  }, [initialized, loading]);

  // Dismiss splash when both conditions are met
  useEffect(() => {
    if (isAppReady && hasSplashMinimumTimeElapsed && !isSplashDismissed) {
      // Add small delay for exit animation
      const timer = setTimeout(() => {
        setIsSplashDismissed(true);
      }, 700); // Match exit animation duration

      return () => clearTimeout(timer);
    }
  }, [isAppReady, hasSplashMinimumTimeElapsed, isSplashDismissed]);

  // Show splash screen until both conditions are met
  const shouldShowSplash = !isSplashDismissed;

  if (shouldShowSplash) {
    return (
      <SplashScreen
        isReady={isAppReady && hasSplashMinimumTimeElapsed}
        timeoutDuration={10000} // 10 seconds max timeout
      />
    );
  }

  // Main app routes (only rendered after splash is dismissed)
  return (
    <SplashContext.Provider value={{ isSplashDismissed }}>
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
    </SplashContext.Provider>
  );
};

const App = () => {
  // Check Supabase configuration before rendering app
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
