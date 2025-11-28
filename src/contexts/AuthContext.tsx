import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { notify } from "@/lib/notifications";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('Auth initialization error:', error);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (!initialized) {
          setLoading(false);
          setInitialized(true);
        }
      }
    );

    initAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        const errorMsg = error.message?.toLowerCase() || '';

        if (errorMsg.includes('invalid') && (errorMsg.includes('credential') || errorMsg.includes('password') || errorMsg.includes('email'))) {
          notify.error(
            "Identifiants incorrects",
            "Vérifiez votre adresse email et votre mot de passe."
          );
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
          notify.network.offline();
        } else {
          notify.error(
            "Erreur de connexion",
            "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
          );
        }
      } else {
        notify.auth.loginSuccess();
      }

      return { error };
    } catch (error: any) {
      notify.network.offline();
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        const errorMsg = error.message?.toLowerCase() || '';

        if (errorMsg.includes('already') && errorMsg.includes('registered')) {
          notify.error(
            "Email déjà utilisé",
            "Un compte existe déjà avec cette adresse email."
          );
        } else if (errorMsg.includes('password') && (errorMsg.includes('short') || errorMsg.includes('weak'))) {
          notify.error(
            "Mot de passe trop faible",
            "Le mot de passe doit contenir au moins 6 caractères."
          );
        } else if (errorMsg.includes('email') && errorMsg.includes('invalid')) {
          notify.error(
            "Email invalide",
            "Veuillez entrer une adresse email valide."
          );
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
          notify.network.offline();
        } else {
          notify.error(
            "Erreur d'inscription",
            "Une erreur inattendue s'est produite. Veuillez réessayer plus tard."
          );
        }
      } else {
        notify.auth.signupSuccess();
      }

      return { error };
    } catch (error: any) {
      notify.network.offline();
      return { error };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        notify.error("Erreur", "Impossible de renvoyer l'email de confirmation");
        return { error };
      }

      notify.success("Email envoyé", "Un nouvel email de confirmation a été envoyé");
      return { error: null };
    } catch (error: any) {
      notify.error("Erreur", "Impossible de renvoyer l'email de confirmation");
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    notify.auth.logoutSuccess();
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        method: 'POST',
      });

      if (error) throw error;

      await supabase.auth.signOut();

      notify.success("Compte supprimé", "Votre compte a été supprimé avec succès");
    } catch (error: any) {
      console.error('Error deleting account:', error);
      notify.error("Erreur", "Impossible de supprimer le compte");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, initialized, signIn, signUp, signOut, deleteAccount, resendConfirmationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};