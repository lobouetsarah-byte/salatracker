# Changelog

Toutes les modifications notables de Salatrack seront documentées dans ce fichier.

## [1.0.0] - 2025-11-06

### ✨ Ajouté
- Application PWA installable avec support offline complet
- Système d'authentification sécurisé (inscription, connexion, déconnexion)
- Suivi des 5 prières quotidiennes (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Suivi des dhikr quotidiens (matin et soir)
- Notifications locales pour rappel des prières
- Statistiques hebdomadaires de progression
- Support multilingue (Français / Anglais)
- Thème sombre/clair
- Capacitor pour build Android et iOS
- Headers de sécurité (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- SEO optimisé (meta tags, sitemap.xml, robots.txt)
- Analytics avec Plausible
- Icônes PWA 192x192 et 512x512
- Service worker avec cache stratégique

### 🔧 Optimisé
- Performance générale de l'application
- Gestion du cache offline
- Temps de chargement initial
- Responsive design pour tous les écrans

### 🔒 Sécurité
- Headers HTTP sécurisés
- Authentification via Supabase
- Validation des entrées utilisateur avec Zod
- Protection CSRF et XSS
- HTTPS forcé en production

### 📱 Mobile
- Support PWA pour installation mobile
- Build natif Android/iOS via Capacitor
- Notifications locales natives
- Splash screen personnalisé
- Gestion du mode hors ligne
