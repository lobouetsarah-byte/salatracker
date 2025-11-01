import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowRight, ArrowLeft } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [firstName, setFirstName] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goalOptions = [
    { 
      id: "track_progress", 
      label: language === "fr" ? "Suivre mes progrès" : "Track my progress" 
    },
    { 
      id: "consistent_prayer", 
      label: language === "fr" ? "Être plus assidue dans ma salat" : "Be more consistent in my prayers" 
    },
    { 
      id: "dhikr", 
      label: language === "fr" ? "Faire mes invocations" : "Do my supplications" 
    },
    { 
      id: "start_praying", 
      label: language === "fr" ? "Commencer à prier" : "Start praying" 
    },
  ];

  const toggleGoal = (goalId: string) => {
    setGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleNext = () => {
    if (step === 1 && !firstName.trim()) {
      toast({
        title: language === "fr" ? "Prénom requis" : "First name required",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && goals.length === 0) {
      toast({
        title: language === "fr" ? "Sélectionnez au moins un objectif" : "Select at least one goal",
        variant: "destructive",
      });
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: language === "fr" ? "Tous les champs sont requis" : "All fields required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Sign up with metadata
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      // Update profile with goals
      if (data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ goals })
          .eq('id', data.user.id);

        if (updateError) throw updateError;
      }

      toast({
        title: language === "fr" ? "Compte créé avec succès !" : "Account created successfully!",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={salatrackLogo} alt="Salatrack" className="w-20 h-20 mx-auto mb-4" />
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {language === "fr" ? "Bienvenue" : "Welcome"}
            </CardTitle>
            <CardDescription>
              {language === "fr" ? `Étape ${step} sur 4` : `Step ${step} of 4`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    {language === "fr" ? "Quel est votre prénom ?" : "What is your first name?"}
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder={language === "fr" ? "Votre prénom" : "Your first name"}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Button onClick={handleNext} className="w-full h-12" size="lg">
                  {language === "fr" ? "Suivant" : "Next"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>
                    {language === "fr" ? "Quels sont vos objectifs ?" : "What are your goals?"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Sélectionnez un ou plusieurs" : "Select one or more"}
                  </p>
                  {goalOptions.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors cursor-pointer"
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <Checkbox
                        id={goal.id}
                        checked={goals.includes(goal.id)}
                        onCheckedChange={() => toggleGoal(goal.id)}
                      />
                      <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                        {goal.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1 h-12">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "fr" ? "Retour" : "Back"}
                  </Button>
                  <Button onClick={handleNext} className="flex-1 h-12">
                    {language === "fr" ? "Suivant" : "Next"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    {language === "fr" ? "Votre adresse email" : "Your email address"}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={language === "fr" ? "votre@email.com" : "your@email.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBack} variant="outline" className="flex-1 h-12">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "fr" ? "Retour" : "Back"}
                  </Button>
                  <Button onClick={handleNext} className="flex-1 h-12">
                    {language === "fr" ? "Suivant" : "Next"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">
                    {language === "fr" ? "Créez un mot de passe" : "Create a password"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "fr" ? "Minimum 6 caractères" : "Minimum 6 characters"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" onClick={handleBack} variant="outline" className="flex-1 h-12">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {language === "fr" ? "Retour" : "Back"}
                  </Button>
                  <Button type="submit" disabled={loading} className="flex-1 h-12">
                    {loading ? "..." : (language === "fr" ? "Créer mon compte" : "Create my account")}
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

export default Onboarding;
