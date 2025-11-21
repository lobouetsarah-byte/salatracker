import { toast } from "sonner";

interface NotificationOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notify = {
  success: (title: string, description?: string, options?: NotificationOptions) => {
    toast.success(title, {
      description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  error: (title: string, description?: string, options?: NotificationOptions) => {
    toast.error(title, {
      description,
      duration: options?.duration || 5000,
      action: options?.action,
    });
  },

  info: (title: string, description?: string, options?: NotificationOptions) => {
    toast.info(title, {
      description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  warning: (title: string, description?: string, options?: NotificationOptions) => {
    toast.warning(title, {
      description,
      duration: options?.duration || 4000,
      action: options?.action,
    });
  },

  auth: {
    loginSuccess: () => {
      toast.success("Connexion réussie", {
        description: "Bienvenue sur Salatracker",
        duration: 3000,
      });
    },

    loginError: (message?: string) => {
      toast.error("Erreur de connexion", {
        description: message || "Adresse email ou mot de passe incorrect",
        duration: 5000,
      });
    },

    signupSuccess: () => {
      toast.success("Compte créé avec succès", {
        description: "Vous pouvez maintenant vous connecter",
        duration: 4000,
      });
    },

    signupError: (message?: string) => {
      toast.error("Erreur d'inscription", {
        description: message || "Une erreur est survenue lors de l'inscription",
        duration: 5000,
      });
    },

    logoutSuccess: () => {
      toast.info("Déconnexion", {
        description: "Vous êtes maintenant déconnecté",
        duration: 3000,
      });
    },

    resetPasswordEmailSent: () => {
      toast.success("Email envoyé", {
        description: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation",
        duration: 5000,
      });
    },

    resetPasswordEmailError: (message?: string) => {
      toast.error("Erreur d'envoi", {
        description: message || "Impossible d'envoyer l'email de réinitialisation",
        duration: 5000,
      });
    },

    passwordUpdateSuccess: () => {
      toast.success("Mot de passe mis à jour", {
        description: "Votre mot de passe a été modifié avec succès",
        duration: 4000,
      });
    },

    passwordUpdateError: (message?: string) => {
      toast.error("Erreur de mise à jour", {
        description: message || "Impossible de mettre à jour le mot de passe",
        duration: 5000,
      });
    },

    rateLimitExceeded: (seconds: number) => {
      toast.warning("Trop de tentatives", {
        description: `Veuillez patienter ${seconds} secondes avant de réessayer`,
        duration: 5000,
      });
    },
  },

  network: {
    offline: () => {
      toast.error("Hors ligne", {
        description: "Vérifiez votre connexion internet",
        duration: 5000,
        action: {
          label: "Réessayer",
          onClick: () => window.location.reload(),
        },
      });
    },

    serverError: () => {
      toast.error("Erreur serveur", {
        description: "Le serveur ne répond pas. Réessayez dans quelques instants",
        duration: 5000,
        action: {
          label: "Recharger",
          onClick: () => window.location.reload(),
        },
      });
    },

    timeout: () => {
      toast.error("Délai d'attente dépassé", {
        description: "La requête a pris trop de temps. Vérifiez votre connexion",
        duration: 5000,
      });
    },
  },
};
