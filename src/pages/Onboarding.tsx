import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { ArrowRight, ArrowLeft, TrendingUp, Calendar, BookOpen, Sparkles } from "lucide-react";
import salatrackLogo from "@/assets/salatrack-logo.png";
import { z } from "zod";

// Validation schemas
const firstNameSchema = z.string().trim().min(1, "First name is required").max(50, "First name must be less than 50 characters");
const emailSchema = z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters");
const passwordSchema = z.string().min(8, "Password must be at least 8 characters").max(72, "Password must be less than 72 characters");
const goalsSchema = z.array(z.enum(["track_progress", "consistent_prayer", "dhikr", "start_praying"])).min(1, "Select at least one goal");

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
      label: language === "fr" ? "Suivre mes progrès" : "Track my progress",
      icon: TrendingUp
    },
    { 
      id: "consistent_prayer", 
      label: language === "fr" ? "Être plus assidue dans ma salat" : "Be more consistent in my prayers",
      icon: Calendar
    },
    { 
      id: "dhikr", 
      label: language === "fr" ? "Faire mes invocations" : "Do my supplications",
      icon: BookOpen
    },
    { 
      id: "start_praying", 
      label: language === "fr" ? "Commencer à prier" : "Start praying",
      icon: Sparkles
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
    if (step === 1) {
      const result = firstNameSchema.safeParse(firstName);
      if (!result.success) {
        toast({
          title: language === "fr" ? "Prénom invalide" : "Invalid first name",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    if (step === 2) {
      const result = goalsSchema.safeParse(goals);
      if (!result.success) {
        toast({
          title: language === "fr" ? "Objectifs invalides" : "Invalid goals",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    if (step === 3) {
      const result = emailSchema.safeParse(email);
      if (!result.success) {
        toast({
          title: language === "fr" ? "Email invalide" : "Invalid email",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all inputs
    const firstNameResult = firstNameSchema.safeParse(firstName);
    const emailResult = emailSchema.safeParse(email);
    const passwordResult = passwordSchema.safeParse(password);
    const goalsResult = goalsSchema.safeParse(goals);
    
    if (!firstNameResult.success) {
      toast({
        title: language === "fr" ? "Prénom invalide" : "Invalid first name",
        description: firstNameResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    if (!emailResult.success) {
      toast({
        title: language === "fr" ? "Email invalide" : "Invalid email",
        description: emailResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    if (!passwordResult.success) {
      toast({
        title: language === "fr" ? "Mot de passe invalide" : "Invalid password",
        description: passwordResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    if (!goalsResult.success) {
      toast({
        title: language === "fr" ? "Objectifs invalides" : "Invalid goals",
        description: goalsResult.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Sign up with validated data
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailResult.data,
        password: passwordResult.data,
        options: {
          data: {
            first_name: firstNameResult.data,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (signUpError) throw signUpError;

      // Update profile with validated goals
      if (data.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ goals: goalsResult.data })
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img src={salatrackLogo} alt="Salatracker" className="w-20 h-20 mx-auto mb-4" />
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {language === "fr" ? "Créer un compte" : "Create Account"}
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
                  <Label className="text-lg">
                    {language === "fr" ? "Quels sont vos objectifs ?" : "What are your goals?"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Sélectionnez un ou plusieurs" : "Select one or more"}
                  </p>
                  <div className="grid gap-3 mt-4">
                    {goalOptions.map((goal) => {
                      const Icon = goal.icon;
                      const isSelected = goals.includes(goal.id);
                      return (
                        <div
                          key={goal.id}
                          onClick={() => toggleGoal(goal.id)}
                          className={`
                            flex items-center gap-4 p-4 rounded-xl cursor-pointer
                            transition-all duration-300 border-2
                            ${isSelected 
                              ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5'
                            }
                          `}
                        >
                          <div className={`
                            p-3 rounded-lg transition-colors
                            ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`flex-1 font-medium ${isSelected ? 'text-primary' : ''}`}>
                            {goal.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
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
                    minLength={8}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === "fr" ? "Minimum 8 caractères" : "Minimum 8 characters"}
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
