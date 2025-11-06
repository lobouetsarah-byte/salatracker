# 🚀 Guide de Déploiement - Salatrack

> **Note :** Pour un guide complet de transformation en application native Android/iOS, consultez [guide-app-native.md](./guide-app-native.md).

## Table des matières
1. [PWA sur Lovable](#pwa-sur-lovable)
2. [Domaine personnalisé](#domaine-personnalisé)
3. [Build natif Android](#build-natif-android)
4. [Build natif iOS](#build-natif-ios)
5. [Tests et validation](#tests-et-validation)
6. [Health Check automatique](#health-check-automatique)

---

## PWA sur Lovable

### Prérequis
- Compte Lovable actif
- Projet Salatrack connecté à Lovable
- Code source à jour sur la branche principale

### Étapes de déploiement

1. **Build de production**
   ```bash
   npm ci
   npm run build
   ```

2. **Vérification pré-déploiement**
   ```bash
   # Servir le build localement
   npx serve -s dist
   
   # Tester sur http://localhost:3000
   # Vérifier :
   # - Pas d'erreurs console
   # - Installation PWA fonctionne
   # - Offline mode opérationnel
   # - Service worker actif
   ```

3. **Publication sur Lovable**
   - Dans le dashboard Lovable : cliquer sur **Publish**
   - Attendre la fin du build (~ 2-5 minutes)
   - URL temporaire : `https://preview--salatrack.lovable.app`

4. **Vérification post-déploiement**
   - [ ] App accessible
   - [ ] Manifest valide
   - [ ] Service worker enregistré
   - [ ] Aucune erreur console
   - [ ] Lighthouse score ≥ 90

---

## Domaine personnalisé

### Configuration DNS

Vous devez ajouter les enregistrements DNS suivants chez votre registrar :

#### Pour `salatrack.app` (domaine principal)
```
Type: A
Name: @
Value: [IP fournie par Lovable]
TTL: 3600
```

#### Pour `app.salatracker.com` (sous-domaine)
```
Type: CNAME
Name: app
Value: [target fourni par Lovable]
TTL: 3600
```

#### Vérification TXT (si demandé par Lovable)
```
Type: TXT
Name: _lovable
Value: [code de vérification fourni par Lovable]
TTL: 3600
```

### Dans Lovable

1. **Connecter le domaine**
   - Aller dans **Settings** > **Domains**
   - Cliquer **Connect Domain**
   - Entrer `app.salatracker.com`
   - Suivre les instructions pour ajouter les DNS

2. **Attendre la propagation DNS**
   - Peut prendre de 1 à 72 heures
   - Vérifier avec : `nslookup app.salatracker.com`

3. **SSL automatique**
   - Lovable génère automatiquement un certificat Let's Encrypt
   - HTTPS sera forcé automatiquement

### Mise à jour des URLs dans le code

Une fois le domaine actif, mettre à jour :

```typescript
// vite.config.ts
start_url: "https://app.salatracker.com/"

// capacitor.config.ts
server: {
  url: 'https://app.salatracker.com',
  cleartext: false
}

// index.html - balises meta
<meta property="og:url" content="https://app.salatracker.com/" />
```

---

## Build natif Android

### Prérequis
- Node.js ≥ 18
- Java JDK 17+
- Android Studio installé
- Gradle configuré

### Étapes

1. **Préparer le build web**
   ```bash
   npm run build
   ```

2. **Synchroniser avec Capacitor**
   ```bash
   npx cap sync android
   ```

3. **Ouvrir dans Android Studio**
   ```bash
   npx cap open android
   ```

4. **Configuration dans Android Studio**
   - Ouvrir `android/app/build.gradle`
   - Vérifier `applicationId "com.salatrack.app"`
   - Vérifier `versionCode 1` et `versionName "1.0.0"`

5. **Générer icônes et splash screen**
   ```bash
   npx capacitor-assets generate --android
   ```

6. **Build de l'APK (debug)**
   - Dans Android Studio : **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
   - APK généré dans : `android/app/build/outputs/apk/debug/app-debug.apk`

7. **Build de l'AAB (production Play Store)**
   - Dans Android Studio : **Build** > **Generate Signed Bundle / APK**
   - Sélectionner **Android App Bundle**
   - Créer ou sélectionner un keystore
   - AAB généré dans : `android/app/build/outputs/bundle/release/app-release.aab`

### Keystore (signature de l'app)

Pour Play Store, il faut signer l'app :

```bash
# Générer un keystore
keytool -genkey -v -keystore salatrack-release.keystore \
  -alias salatrack -keyalg RSA -keysize 2048 -validity 10000

# Configurer dans android/app/build.gradle
android {
  signingConfigs {
    release {
      storeFile file('../../salatrack-release.keystore')
      storePassword 'your-password'
      keyAlias 'salatrack'
      keyPassword 'your-password'
    }
  }
}
```

⚠️ **Important** : Ne jamais commit le keystore dans Git !

### Permissions Android

Vérifier dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />
```

### Publication sur Google Play

1. Créer un compte développeur Google Play (25$ one-time)
2. Créer une nouvelle app sur la console Play Store
3. Uploader l'AAB signé
4. Remplir les informations (description, screenshots, catégories)
5. Soumettre pour review

---

## Build natif iOS

### Prérequis
- macOS avec Xcode 14+
- Compte Apple Developer (99$/an)
- CocoaPods installé (`sudo gem install cocoapods`)

### Étapes

1. **Préparer le build web**
   ```bash
   npm run build
   ```

2. **Synchroniser avec Capacitor**
   ```bash
   npx cap sync ios
   ```

3. **Ouvrir dans Xcode**
   ```bash
   npx cap open ios
   ```

4. **Configuration dans Xcode**
   - Sélectionner le projet `App` dans la barre latérale
   - Onglet **General**
     - Bundle Identifier : `com.salatrack.app`
     - Version : `1.0.0`
     - Build : `1`
   - Onglet **Signing & Capabilities**
     - Cocher **Automatically manage signing**
     - Sélectionner votre Team (compte Apple Developer)

5. **Générer icônes et splash screen**
   ```bash
   npx capacitor-assets generate --ios
   ```

6. **Build pour appareil physique**
   - Connecter un iPhone via USB
   - Sélectionner l'appareil dans la barre d'outils Xcode
   - Cliquer sur le bouton ▶️ (Run)

7. **Archive pour TestFlight / App Store**
   - Dans Xcode : **Product** > **Archive**
   - Une fois l'archive créée, cliquer **Distribute App**
   - Sélectionner **App Store Connect**
   - Suivre les étapes pour uploader

### Capabilities iOS

Dans Xcode, onglet **Signing & Capabilities**, ajouter :

- **Push Notifications**
- **Background Modes** (pour les notifications en arrière-plan)

### Info.plist

Ajouter les permissions nécessaires dans `ios/App/App/Info.plist` :

```xml
<key>NSUserNotificationsUsageDescription</key>
<string>Salatrack a besoin d'envoyer des notifications pour vous rappeler vos prières.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Salatrack utilise le micro pour jouer l'Adhan.</string>
```

### Publication sur App Store

1. Créer un compte Apple Developer (99$/an)
2. Dans App Store Connect, créer une nouvelle app
3. Uploader le build via Xcode (Archive)
4. Remplir les informations (description, screenshots, keywords)
5. Soumettre pour review (délai : 1-3 jours)

---

## Tests et validation

### Checklist avant publication

#### Fonctionnel
- [ ] Inscription / Connexion / Déconnexion
- [ ] Ajout / Édition / Suppression de prière
- [ ] Notifications locales fonctionnelles
- [ ] Audio Adhan joué correctement
- [ ] Statistiques affichées
- [ ] Mode offline opérationnel
- [ ] Navigation fluide
- [ ] Pas d'erreurs console

#### PWA
- [ ] Installable sur mobile
- [ ] Service worker actif
- [ ] Cache offline configuré
- [ ] Manifest valide
- [ ] Icônes présentes (192x192, 512x512)
- [ ] Splash screen affiché

#### SEO
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Meta tags complets (title, description, og:*)
- [ ] Canonical URL défini
- [ ] Structured data (si applicable)

#### Sécurité
- [ ] HTTPS forcé
- [ ] Headers de sécurité (X-Frame-Options, etc.)
- [ ] Pas de secrets dans le code
- [ ] Validation des entrées utilisateur
- [ ] Authentification sécurisée

#### Performance
- [ ] Lighthouse score ≥ 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Bundle size optimisé
- [ ] Images optimisées

### Tests automatisés

```bash
# Playwright
npx playwright test

# Cypress
npx cypress run

# Health check
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

---

## Health Check automatique

### Mise en place

1. **Rendre le script exécutable**
   ```bash
   chmod +x scripts/health-check.sh
   ```

2. **Tester manuellement**
   ```bash
   ./scripts/health-check.sh
   ```

3. **Automatiser avec cron (Linux/macOS)**
   ```bash
   # Éditer crontab
   crontab -e
   
   # Ajouter cette ligne (exécution quotidienne à 6h)
   0 6 * * * /chemin/vers/salatrack/scripts/health-check.sh >> /var/log/salatrack-health.log 2>&1
   ```

4. **Automatiser avec GitHub Actions (CI/CD)**
   
   Créer `.github/workflows/health-check.yml` :
   ```yaml
   name: Health Check
   on:
     schedule:
       - cron: '0 6 * * *'  # Tous les jours à 6h UTC
     workflow_dispatch:  # Permettre exécution manuelle
   
   jobs:
     health-check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Run Health Check
           run: |
             chmod +x scripts/health-check.sh
             ./scripts/health-check.sh
   ```

### Monitoring avec Uptime Robot (gratuit)

1. Créer un compte sur [UptimeRobot.com](https://uptimerobot.com)
2. Ajouter un monitor :
   - Type : HTTP(s)
   - URL : `https://app.salatracker.com/health.html`
   - Interval : 5 minutes
3. Configurer les alertes (email, SMS, Slack)

### Alertes email

Modifier `scripts/health-check.sh` pour envoyer un email en cas d'erreur :

```bash
# À la fin du script
if [ $errors -ne 0 ]; then
  echo "Erreurs détectées sur Salatrack" | mail -s "🚨 Health Check Failed" admin@salatrack.app
fi
```

---

## Ressources

- [Documentation Lovable](https://docs.lovable.dev/)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [PWA Builder](https://www.pwabuilder.com/)
