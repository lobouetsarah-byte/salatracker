import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserX, ArrowLeft } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { z } from "zod";

const emailSchema = z.string().trim().email("Email invalide").max(255, "Email trop long");
const passwordSchema = z.string().min(8, "Minimum 8 caractères").max(72, "Maximum 72 caractères");

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signIn } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const activeTab = searchParams.get("tab") || "login";

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check cooldown
    if (cooldownUntil && new Date() < cooldownUntil) {
      const remainingSeconds = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
      toast({
        title: "Trop de tentatives",
        description: `Veuillez patienter ${remainingSeconds} secondes`,
        variant: "destructive",
      });
      return;
    }

    // Validate input
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);
    
    if (!emailResult.success) {
      toast({
        title: "Email invalide",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    if (!passwordResult.success) {
      toast({
        title: "Mot de passe invalide",
        description: passwordResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(emailResult.data, passwordResult.data);
    setLoading(false);
    
    if (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        const cooldown = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        setCooldownUntil(cooldown);
        toast({
          title: "Trop de tentatives échouées",
          description: "Veuillez patienter 5 minutes avant de réessayer",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
      }
    } else {
      setLoginAttempts(0);
      setCooldownUntil(null);
      navigate("/");
    }
  };

  const handleBackToOnboarding = () => {
    navigate("/onboarding");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    // Validate email
    const emailResult = emailSchema.safeParse(resetEmail);
    if (!emailResult.success) {
      toast({
        title: "Email invalide",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(emailResult.data, {
        redirectTo: `${window.location.origin}/auth`,
      });
      
      if (error) throw error;
      
      toast({
        title: t.checkEmail,
        description: t.resetEmailSent,
      });
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      toast({
        title: t.errorOccurred,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-6">
          <img src={salatrackLogo} alt="Salatracker" className="w-20 h-20 mx-auto mb-4" />
        </div>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t.appTitle}</CardTitle>
            <CardDescription>{t.trackProgress}</CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForgotPassword(false)}
                  className="mb-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.backToLogin}
                </Button>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">{t.email}</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder={t.email}
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "..." : t.sendResetLink}
                  </Button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">{t.email}</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder={t.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">{t.password}</Label>
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowForgotPassword(true)}
                  className="px-0 h-auto font-normal"
                >
                  {t.forgotPassword}
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "..." : t.signIn}
                </Button>
                <div className="text-center pt-4 border-t border-border mt-4">
                  <p className="text-sm text-muted-foreground mb-3 mt-4">
                    Pas encore de compte ?
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToOnboarding}
                    className="w-full"
                    size="lg"
                  >
                    {t.createAccount}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;