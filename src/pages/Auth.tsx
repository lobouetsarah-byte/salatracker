import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Auth = () => {
  const navigate = useNavigate();
  const { user, guestMode, loading: authLoading, signIn, signUp, continueAsGuest } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  useEffect(() => {
    if (user || guestMode) {
      navigate("/");
    }
  }, [user, guestMode, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    
    if (!error) {
      navigate("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password);
    setLoading(false);
    
    if (!error) {
      // After signup, automatically sign in
      await signIn(email, password);
      navigate("/");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
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
          <img src={salatrackLogo} alt="Salatrack" className="w-20 h-20 mx-auto mb-4" />
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
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{t.login}</TabsTrigger>
                  <TabsTrigger value="signup">{t.signup}</TabsTrigger>
                </TabsList>
              
                <TabsContent value="login">
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
                  </form>
                </TabsContent>
              
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">{t.email}</Label>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder={t.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">{t.password}</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "..." : t.createAccount}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
            
            {!showForgotPassword && (
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    continueAsGuest();
                    navigate("/");
                  }}
                >
                  <UserX className="mr-2 h-4 w-4" />
                  {t.continueAsGuest}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  {t.progressNotSaved}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;