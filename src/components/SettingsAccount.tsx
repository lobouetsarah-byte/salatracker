import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Target, LogOut, Trash2, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

export const SettingsAccount = () => {
  const { user, signOut, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditFirstName, setShowEditFirstName] = useState(false);
  const [showEditGoals, setShowEditGoals] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const goalOptions = [
    { 
      id: "track_progress", 
      label: language === "fr" ? "Suivre mes progrès" : "Track my progress",
      icon: "📊"
    },
    { 
      id: "consistent_prayer", 
      label: language === "fr" ? "Être plus assidue dans ma salat" : "Be more consistent in my prayers",
      icon: "📅"
    },
    { 
      id: "dhikr", 
      label: language === "fr" ? "Faire mes invocations" : "Do my supplications",
      icon: "📖"
    },
    { 
      id: "start_praying", 
      label: language === "fr" ? "Commencer à prier" : "Start praying",
      icon: "✨"
    },
  ];

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (!error && data) {
      setProfile(data);
      setNewFirstName(data.first_name || "");
      setSelectedGoals(data.goals || []);
    }
  };

  const handleUpdateFirstName = async () => {
    if (!user || !newFirstName.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ first_name: newFirstName })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: language === "fr" ? "Prénom mis à jour" : "First name updated",
      });
      setShowEditFirstName(false);
      loadProfile();
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

  const handleUpdateGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ goals: selectedGoals })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: language === "fr" ? "Objectifs mis à jour" : "Goals updated",
      });
      setShowEditGoals(false);
      loadProfile();
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

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/onboarding");
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    navigate("/onboarding");
  };

  if (!user) {
    return (
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t.myAccount}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline"
            className="w-full"
            onClick={() => navigate("/auth")}
          >
            {t.signIn}
          </Button>
          <Button 
            className="w-full"
            onClick={() => navigate("/onboarding")}
          >
            {t.createAccount}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="w-5 h-5 text-primary" />
            </div>
            {language === "fr" ? "Détails du compte" : "Account Details"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Mail className="w-4 h-4 text-primary" />
              {t.email}
            </Label>
            <p className="text-muted-foreground pl-6">{user.email}</p>
          </div>

          <Separator />

          {/* First Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                {language === "fr" ? "Prénom" : "First Name"}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditFirstName(!showEditFirstName)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {showEditFirstName ? (
              <div className="flex gap-2">
                <Input
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder={language === "fr" ? "Votre prénom" : "Your first name"}
                />
                <Button onClick={handleUpdateFirstName} disabled={loading}>
                  {language === "fr" ? "Enregistrer" : "Save"}
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground">{profile?.first_name || "—"}</p>
            )}
          </div>

          <Separator />

          {/* Goals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Target className="w-4 h-4 text-primary" />
                {language === "fr" ? "Objectifs" : "Goals"}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditGoals(!showEditGoals)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {showEditGoals ? (
              <div className="space-y-3">
                {goalOptions.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <div
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg cursor-pointer
                        transition-all duration-200 border-2
                        ${isSelected 
                          ? 'bg-primary/10 border-primary' 
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }
                      `}
                    >
                      <span className="text-2xl">{goal.icon}</span>
                      <span className={`flex-1 ${isSelected ? 'font-semibold text-primary' : ''}`}>
                        {goal.label}
                      </span>
                    </div>
                  );
                })}
                <Button onClick={handleUpdateGoals} disabled={loading} className="w-full mt-4">
                  {language === "fr" ? "Enregistrer" : "Save"}
                </Button>
              </div>
            ) : (
              <div className="text-muted-foreground space-y-1">
                {profile?.goals?.length > 0 ? (
                  profile.goals.map((goalId: string) => {
                    const goal = goalOptions.find(g => g.id === goalId);
                    return goal ? <div key={goalId}>• {goal.label}</div> : null;
                  })
                ) : (
                  <p>—</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sign Out & Delete Account */}
      <Card className="shadow-lg border-primary/10">
        <CardContent className="pt-6 space-y-3">
          <Button 
            variant="outline" 
            className="w-full h-12"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t.signOut}
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full h-12"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {language === "fr" ? "Supprimer mon compte" : "Delete my account"}
          </Button>
        </CardContent>
      </Card>

      {/* Legal Links */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-4">
        <Link to="/terms" className="hover:underline">
          {language === "fr" ? "CGV" : "Terms"}
        </Link>
        <span>•</span>
        <Link to="/privacy" className="hover:underline">
          {language === "fr" ? "Confidentialité" : "Privacy"}
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "fr" ? "Êtes-vous sûr ?" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "fr" 
                ? "Cette action est irréversible. Toutes vos données seront supprimées définitivement." 
                : "This action cannot be undone. All your data will be permanently deleted."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "fr" ? "Annuler" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === "fr" ? "Supprimer" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
