import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, KeyRound } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notifications";
import { useLanguage } from "@/hooks/useLanguage";
import { useSwipeBack } from "@/hooks/useSwipeBack";
import { z } from "zod";

// Move schemas outside component to avoid recreation on every render
const emailSchema = z.string().trim().email("Adresse email invalide").max(255, "L'email est trop long");
const passwordSchema = z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères").max(72, "Le mot de passe est trop long (maximum 72 caractères)");

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, signIn } = useAuth();
  const { t } = useLanguage();
  useSwipeBack(); // Enable swipe-back navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Check if user arrived from password reset email
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (type === 'recovery' && accessToken) {
      setIsResettingPassword(true);
    }
  }, []);

  useEffect(() => {
    if (user && !isResettingPassword) {
      navigate("/");
    }
  }, [user, navigate, isResettingPassword]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldownUntil && new Date() < cooldownUntil) {
      const remainingSeconds = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
      notify.auth.rateLimitExceeded(remainingSeconds);
      return;
    }

    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);

    if (!emailResult.success) {
      notify.error("Adresse email invalide", emailResult.error.errors[0].message);
      return;
    }
    if (!passwordResult.success) {
      notify.error("Mot de passe invalide", passwordResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await signIn(emailResult.data, passwordResult.data);
    setLoading(false);

    if (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= 5) {
        const cooldown = new Date(Date.now() + 5 * 60 * 1000);
        setCooldownUntil(cooldown);
        notify.error("Trop de tentatives échouées", "Veuillez patienter 5 minutes avant de réessayer");
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

    const emailResult = emailSchema.safeParse(resetEmail);
    if (!emailResult.success) {
      notify.error("Adresse email invalide", emailResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-reset-password", {
        body: {
          email: emailResult.data,
          redirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      notify.auth.resetPasswordEmailSent();
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      notify.auth.resetPasswordEmailError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notify.error("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    const passwordResult = passwordSchema.safeParse(newPassword);
    if (!passwordResult.success) {
      notify.error("Mot de passe invalide", passwordResult.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordResult.data
      });

      if (error) throw error;

      notify.auth.passwordUpdateSuccess();

      setNewPassword("");
      setConfirmPassword("");
      window.history.replaceState(null, '', '/auth');
      setIsResettingPassword(false);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      notify.auth.passwordUpdateError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white dark:bg-white p-4 overflow-hidden"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        height: '100vh',
        position: 'fixed',
        width: '100%',
        top: 0,
        left: 0
      }}
    >
      <div className="w-full max-w-md space-y-4 overflow-y-auto max-h-full py-4">
        <div className="text-center mb-6">
          <img src={salatrackLogo} alt="Salatracker" className="w-20 h-20 mx-auto mb-4" />
        </div>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{t.appTitle}</CardTitle>
            <CardDescription>{t.trackProgress}</CardDescription>
          </CardHeader>
          <CardContent>
            {isResettingPassword ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <KeyRound className="w-12 h-12 text-primary" />
                </div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">Créer un nouveau mot de passe</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez un mot de passe fort avec au moins 8 caractères
                  </p>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Minimum 8 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    {newPassword && newPassword.length < 8 && (
                      <p className="text-xs text-destructive">
                        Le mot de passe doit contenir au moins 8 caractères
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Retapez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-destructive">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                  >
                    {loading ? "⏳ Mise à jour en cours..." : "✓ Confirmer le nouveau mot de passe"}
                  </Button>
                </form>
              </div>
            ) : showForgotPassword ? (
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
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation
                  </p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">{t.email}</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading || !resetEmail}>
                    {loading ? "📧 Envoi en cours..." : "📧 Envoyer le lien de réinitialisation"}
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