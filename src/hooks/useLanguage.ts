import { useState, useEffect } from "react";

export type Language = "fr" | "en";

interface Translations {
  // App
  appTitle: string;
  
  // Tabs
  dashboard: string;
  prayers: string;
  atkar: string;
  settings: string;
  
  // Prayer names
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  
  // Prayer status
  pending: string;
  onTime: string;
  late: string;
  missed: string;
  dhikrDone: string;
  dhikrPending: string;
  
  // Actions
  markOnTime: string;
  markLate: string;
  markMissed: string;
  deleteStatus: string;
  nextPrayer: string;
  
  // Stats
  weeklyProgress: string;
  dailyProgress: string;
  monthlyProgress: string;
  totalPrayers: string;
  completionRate: string;
  
  // Atkar
  morningAtkar: string;
  eveningAtkar: string;
  
  // Settings
  notificationSettings: string;
  languageSettings: string;
  prayerTimeNotifications: string;
  missedPrayerReminders: string;
  language: string;
  french: string;
  english: string;
  aboutNotifications: string;
  notificationPermission: string;
  
  // Account
  myAccount: string;
  email: string;
  password: string;
  newPassword: string;
  currentPassword: string;
  updateEmail: string;
  updatePassword: string;
  signOut: string;
  signIn: string;
  forgotPassword: string;
  resetPassword: string;
  sendResetLink: string;
  backToLogin: string;
  checkEmail: string;
  resetEmailSent: string;
  
  // Auth
  login: string;
  signup: string;
  createAccount: string;
  continueAsGuest: string;
  progressNotSaved: string;
  trackProgress: string;
  
  // Messages
  footer: string;
  prayerTimesProvider: string;
  emailUpdated: string;
  passwordUpdated: string;
  errorOccurred: string;
}

const translations: Record<Language, Translations> = {
  fr: {
    appTitle: "Salatrack",
    dashboard: "Progrès",
    prayers: "Prières",
    atkar: "Atkar",
    settings: "Paramètres",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    pending: "En attente",
    onTime: "À l'heure",
    late: "En retard",
    missed: "Manquée",
    dhikrDone: "Dhikr fait",
    dhikrPending: "Dhikr à faire",
    markOnTime: "À l'heure",
    markLate: "En retard",
    markMissed: "Manquée",
    deleteStatus: "Supprimer",
    nextPrayer: "Prochaine prière",
    weeklyProgress: "Progrès de la semaine",
    dailyProgress: "Progrès du jour",
    monthlyProgress: "Progrès du mois",
    totalPrayers: "Total de prières",
    completionRate: "Taux de complétion",
    morningAtkar: "Atkar du matin",
    eveningAtkar: "Atkar du soir",
    notificationSettings: "Paramètres de notification",
    languageSettings: "Paramètres de langue",
    prayerTimeNotifications: "Notifications de l'heure de prière",
    missedPrayerReminders: "Rappels de prières manquées",
    language: "Langue",
    french: "Français",
    english: "English",
    aboutNotifications: "À propos des notifications",
    notificationPermission: "Les notifications du navigateur nécessitent votre autorisation. Si vous n'avez pas encore accordé l'autorisation, vous serez invité lorsque les notifications seront activées. Assurez-vous que les notifications sont autorisées dans les paramètres de votre navigateur pour une meilleure expérience.",
    myAccount: "Mon compte",
    email: "Email",
    password: "Mot de passe",
    newPassword: "Nouveau mot de passe",
    currentPassword: "Mot de passe actuel",
    updateEmail: "Modifier l'email",
    updatePassword: "Modifier le mot de passe",
    signOut: "Se déconnecter",
    signIn: "Se connecter",
    forgotPassword: "Mot de passe oublié ?",
    resetPassword: "Réinitialiser le mot de passe",
    sendResetLink: "Envoyer le lien",
    backToLogin: "Retour à la connexion",
    checkEmail: "Vérifiez votre email",
    resetEmailSent: "Un lien de réinitialisation a été envoyé à votre adresse email",
    login: "Connexion",
    signup: "Inscription",
    createAccount: "Créer un compte",
    continueAsGuest: "Continuer sans compte",
    progressNotSaved: "Vos progrès ne seront pas sauvegardés",
    trackProgress: "Suivre vos progrès",
    footer: "Qu'Allah accepte toutes vos prières",
    prayerTimesProvider: "Horaires de prière fournis par Aladhan API",
    emailUpdated: "Email mis à jour avec succès",
    passwordUpdated: "Mot de passe mis à jour avec succès",
    errorOccurred: "Une erreur s'est produite",
  },
  en: {
    appTitle: "Salatrack",
    dashboard: "Progress",
    prayers: "Prayers",
    atkar: "Atkar",
    settings: "Settings",
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",
    pending: "Pending",
    onTime: "On Time",
    late: "Late",
    missed: "Missed",
    dhikrDone: "Dhikr Done",
    dhikrPending: "Dhikr Pending",
    markOnTime: "On Time",
    markLate: "Late",
    markMissed: "Missed",
    deleteStatus: "Delete",
    nextPrayer: "Next Prayer",
    weeklyProgress: "This Week's Progress",
    dailyProgress: "Today's Progress",
    monthlyProgress: "This Month's Progress",
    totalPrayers: "Total Prayers",
    completionRate: "Completion Rate",
    morningAtkar: "Morning Atkar",
    eveningAtkar: "Evening Atkar",
    notificationSettings: "Notification Settings",
    languageSettings: "Language Settings",
    prayerTimeNotifications: "Prayer Time Notifications",
    missedPrayerReminders: "Missed Prayer Reminders",
    language: "Language",
    french: "Français",
    english: "English",
    aboutNotifications: "About Notifications",
    notificationPermission: "Browser notifications require your permission. If you haven't granted permission yet, you'll be prompted when notifications are enabled. Make sure notifications are allowed in your browser settings for the best experience.",
    myAccount: "My Account",
    email: "Email",
    password: "Password",
    newPassword: "New password",
    currentPassword: "Current password",
    updateEmail: "Update email",
    updatePassword: "Update password",
    signOut: "Sign out",
    signIn: "Sign in",
    forgotPassword: "Forgot password?",
    resetPassword: "Reset password",
    sendResetLink: "Send reset link",
    backToLogin: "Back to login",
    checkEmail: "Check your email",
    resetEmailSent: "A reset link has been sent to your email address",
    login: "Login",
    signup: "Sign up",
    createAccount: "Create account",
    continueAsGuest: "Continue as guest",
    progressNotSaved: "Your progress will not be saved",
    trackProgress: "Track your progress",
    footer: "May Allah accept all your prayers",
    prayerTimesProvider: "Prayer times provided by Aladhan API",
    emailUpdated: "Email updated successfully",
    passwordUpdated: "Password updated successfully",
    errorOccurred: "An error occurred",
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>("fr");

  useEffect(() => {
    const stored = localStorage.getItem("language");
    if (stored === "en" || stored === "fr") {
      setLanguage(stored);
    }
  }, []);

  const updateLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  return {
    language,
    updateLanguage,
    t: translations[language],
  };
};
