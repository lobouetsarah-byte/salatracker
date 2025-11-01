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
  
  // Messages
  footer: string;
  prayerTimesProvider: string;
}

const translations: Record<Language, Translations> = {
  fr: {
    appTitle: "Salatrack",
    dashboard: "Tableau de bord",
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
    footer: "Qu'Allah accepte toutes vos prières",
    prayerTimesProvider: "Horaires de prière fournis par Aladhan API",
  },
  en: {
    appTitle: "Salatrack",
    dashboard: "Dashboard",
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
    footer: "May Allah accept all your prayers",
    prayerTimesProvider: "Prayer times provided by Aladhan API",
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
