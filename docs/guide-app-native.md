# 📱 Guide Complet : Transformer Salatrack en Application Native

## 🎯 Vue d'ensemble

Ce guide vous accompagne **étape par étape** pour transformer votre projet web Salatrack en applications natives Android et iOS, prêtes à être publiées sur Google Play Store et Apple App Store.

**Durée estimée :** 
- Android : 4-6 heures (première fois)
- iOS : 6-8 heures (première fois)

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Préparation du projet web](#préparation-du-projet-web)
3. [Installation et configuration Capacitor](#installation-et-configuration-capacitor)
4. [Build Android](#build-android)
5. [Build iOS](#build-ios)
6. [Publication Google Play Store](#publication-google-play-store)
7. [Publication Apple App Store](#publication-apple-app-store)
8. [Troubleshooting](#troubleshooting)
9. [Checklist finale](#checklist-finale)

---

## Prérequis

### 🖥️ Configuration système requise

#### Pour Android (Windows, macOS, Linux)
- **Node.js** : version ≥ 18.0.0
- **Java JDK** : version 17 (recommandé)
- **Android Studio** : dernière version stable
- **Gradle** : installé automatiquement avec Android Studio
- **Espace disque** : minimum 10 GB libres

#### Pour iOS (macOS uniquement)
- **macOS** : version 12 (Monterey) ou supérieure
- **Xcode** : version 14.0 ou supérieure
- **Command Line Tools** : installés via Xcode
- **CocoaPods** : gestionnaire de dépendances iOS
- **Compte Apple Developer** : 99 USD/an (obligatoire pour publier)

---

### 🔧 Installation des outils

#### 1. Vérifier Node.js et npm

```bash
node --version  # doit afficher v18.x.x ou supérieur
npm --version   # doit afficher v9.x.x ou supérieur
```

Si Node.js n'est pas installé : [https://nodejs.org/](https://nodejs.org/)

---

#### 2. Installer Java JDK 17 (pour Android)

**macOS (avec Homebrew) :**
```bash
brew install openjdk@17
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

**Windows :**
1. Télécharger JDK 17 : [https://adoptium.net/](https://adoptium.net/)
2. Installer et configurer `JAVA_HOME` dans les variables d'environnement :
   ```
   JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x
   ```

**Vérification :**
```bash
java -version  # doit afficher "openjdk version 17.x.x"
```

---

#### 3. Installer Android Studio

1. **Télécharger** : [https://developer.android.com/studio](https://developer.android.com/studio)
2. **Installer** avec les composants suivants :
   - Android SDK
   - Android SDK Platform (API 33 minimum)
   - Android Virtual Device (AVD)
3. **Configurer les variables d'environnement** :

**macOS/Linux** (ajouter à `~/.zshrc` ou `~/.bash_profile`) :
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows** (variables d'environnement système) :
```
ANDROID_HOME=C:\Users\VotreNom\AppData\Local\Android\Sdk
Path=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools
```

**Redémarrer le terminal** puis vérifier :
```bash
adb --version  # doit afficher la version d'Android Debug Bridge
```

---

#### 4. Installer Xcode et CocoaPods (macOS uniquement)

**Xcode :**
1. Installer depuis l'App Store (gratuit, ~15 GB)
2. Ouvrir Xcode une première fois pour accepter la licence
3. Installer Command Line Tools :
   ```bash
   xcode-select --install
   ```

**CocoaPods :**
```bash
sudo gem install cocoapods
pod --version  # doit afficher v1.12.x ou supérieur
```

---

## Préparation du projet web

### 1. Exporter le projet depuis Lovable

1. **Dans Lovable**, cliquer sur le bouton **GitHub** (en haut à droite)
2. **Connecter votre compte GitHub** si ce n'est pas déjà fait
3. **Créer un nouveau repository** ou sélectionner un repository existant
4. **Transférer le projet** (cela peut prendre 1-2 minutes)

---

### 2. Cloner le projet localement

```bash
# Remplacer par votre URL de repository
git clone https://github.com/votre-username/salatrack.git
cd salatrack
```

---

### 3. Installer les dépendances

```bash
npm ci
# ou
npm install
```

---

### 4. Vérifier que le build fonctionne

```bash
npm run build
```

Le dossier `dist/` doit être créé sans erreurs.

**⚠️ Important :** Ne passez pas à l'étape suivante si le build échoue.

---

### 5. Tester localement

```bash
npx serve -s dist
# Ouvrir http://localhost:3000
```

Vérifiez que :
- [ ] L'application se charge correctement
- [ ] La connexion / inscription fonctionne
- [ ] Les prières peuvent être créées et modifiées
- [ ] Les notifications s'affichent (si activées)
- [ ] Aucune erreur dans la console du navigateur

---

## Installation et configuration Capacitor

### 1. Installer Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/ios
```

---

### 2. Initialiser Capacitor

```bash
npx cap init
```

**Répondre aux questions** :
- **App name** : `Salatrack`
- **App package ID** : `com.salatrack.app` (⚠️ ne jamais changer après publication)
- **Web asset directory** : `dist`

Cela crée le fichier `capacitor.config.ts`.

---

### 3. Configurer `capacitor.config.ts`

Votre fichier `capacitor.config.ts` devrait ressembler à ceci :

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salatrack.app',
  appName: 'Salatrack',
  webDir: 'dist',
  backgroundColor: '#0c3b2e',
  server: {
    url: 'https://salatrack.app',
    cleartext: false
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#0c3b2e",
      sound: "adhan.mp3",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0c3b2e",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
```

---

### 4. Ajouter les plugins Capacitor nécessaires

```bash
npm install @capacitor/local-notifications
npm install @capacitor/push-notifications
```

---

### 5. Builder le projet web

```bash
npm run build
```

---

### 6. Ajouter les plateformes natives

**Android :**
```bash
npx cap add android
```

**iOS (macOS uniquement) :**
```bash
npx cap add ios
cd ios/App
pod install
cd ../..
```

**⚠️ Important :** Si `pod install` échoue, essayez :
```bash
cd ios/App
pod repo update
pod install
cd ../..
```

---

### 7. Synchroniser le code web avec les projets natifs

```bash
npx cap sync
```

Cette commande :
- Copie le contenu de `dist/` dans les projets natifs
- Met à jour les dépendances natives
- Configure les plugins Capacitor

**💡 À exécuter à chaque fois que vous modifiez le code web.**

---

## Build Android

### 1. Ouvrir le projet dans Android Studio

```bash
npx cap open android
```

Android Studio devrait s'ouvrir avec le projet. **Attendez que Gradle termine la synchronisation** (barre de progression en bas de l'écran).

---

### 2. Configurer le projet Android

#### a) Vérifier `android/app/build.gradle`

Ouvrir `android/app/build.gradle` et vérifier :

```gradle
android {
    namespace "com.salatrack.app"
    compileSdk 34

    defaultConfig {
        applicationId "com.salatrack.app"
        minSdk 22
        targetSdk 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

**⚠️ `applicationId` ne doit JAMAIS changer après la première publication.**

---

#### b) Configurer les permissions

Ouvrir `android/app/src/main/AndroidManifest.xml` et ajouter :

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.USE_EXACT_ALARM" />
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <application
        android:label="Salatrack"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        ...
    </application>
</manifest>
```

---

### 3. Générer les icônes et splash screens

**Option 1 : Utiliser capacitor-assets (recommandé)**

```bash
npm install -g @capacitor/assets
npx capacitor-assets generate --android
```

**Option 2 : Manuellement**

Placer vos icônes dans :
- `android/app/src/main/res/mipmap-mdpi/` (48x48)
- `android/app/src/main/res/mipmap-hdpi/` (72x72)
- `android/app/src/main/res/mipmap-xhdpi/` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/` (192x192)

---

### 4. Tester sur un émulateur

**Créer un émulateur Android :**
1. Dans Android Studio : **Tools** → **Device Manager**
2. **Create Device** → Sélectionner **Pixel 6**
3. **Next** → Télécharger une image système (API 33 recommandé)
4. **Finish**

**Lancer l'app :**
1. Sélectionner l'émulateur dans la barre d'outils
2. Cliquer sur le bouton ▶️ **Run**

**Vérifier :**
- [ ] L'application s'ouvre sans crash
- [ ] La navigation fonctionne
- [ ] Les notifications peuvent être activées
- [ ] Les prières sont enregistrées

---

### 5. Créer un Keystore (pour signature)

⚠️ **CRITIQUE** : Le keystore permet de signer votre app. **Ne le perdez JAMAIS** sinon vous ne pourrez plus publier de mises à jour.

```bash
keytool -genkey -v -keystore salatrack-release.keystore \
  -alias salatrack \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Répondre aux questions** :
- **Mot de passe** : choisissez un mot de passe fort (notez-le dans un endroit sûr)
- **Nom, organisation** : vos informations
- **Mot de passe de l'alias** : peut être identique au mot de passe du keystore

**Sauvegarder le keystore** :
- [ ] Copier `salatrack-release.keystore` dans un endroit sûr (cloud, coffre-fort)
- [ ] Noter le mot de passe et l'alias quelque part de sécurisé
- [ ] ⚠️ Ne JAMAIS commit le keystore dans Git

---

### 6. Configurer la signature dans Gradle

Créer le fichier `android/key.properties` :

```properties
storePassword=VotreMotDePasse
keyPassword=VotreMotDePasseAlias
keyAlias=salatrack
storeFile=../../salatrack-release.keystore
```

**⚠️ Ajouter à `.gitignore` :**
```
android/key.properties
*.keystore
```

---

Modifier `android/app/build.gradle` :

```gradle
// En haut du fichier (après plugins)
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

### 7. Générer l'APK (test)

**Dans Android Studio** :
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Attendre la fin du build (1-3 minutes)
3. Cliquer sur **locate** dans la notification

**En ligne de commande** :
```bash
cd android
./gradlew assembleRelease
cd ..
```

**L'APK se trouve ici** :
```
android/app/build/outputs/apk/release/app-release.apk
```

---

### 8. Générer l'AAB (pour Google Play)

**Dans Android Studio** :
1. **Build** → **Generate Signed Bundle / APK**
2. Sélectionner **Android App Bundle**
3. **Next** → Sélectionner votre keystore
4. Entrer les mots de passe
5. **Next** → Sélectionner **release**
6. **Finish**

**En ligne de commande** :
```bash
cd android
./gradlew bundleRelease
cd ..
```

**L'AAB se trouve ici** :
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

### 9. Tester l'APK sur un appareil physique

**Activer le mode développeur** sur votre téléphone Android :
1. **Paramètres** → **À propos du téléphone**
2. Appuyer 7 fois sur **Numéro de build**
3. **Paramètres** → **Options pour les développeurs**
4. Activer **Débogage USB**

**Installer l'APK** :
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Vérifier :**
- [ ] L'application s'installe correctement
- [ ] Toutes les fonctionnalités marchent
- [ ] Les notifications fonctionnent
- [ ] L'icône et le nom sont corrects

---

## Build iOS

### 1. Ouvrir le projet dans Xcode

```bash
npx cap open ios
```

Xcode devrait s'ouvrir avec le projet `App.xcworkspace`.

---

### 2. Configurer le projet iOS

#### a) Sélectionner le projet `App` dans la barre latérale

#### b) Onglet **General**

- **Display Name** : `Salatrack`
- **Bundle Identifier** : `com.salatrack.app` (⚠️ doit être unique et jamais changé)
- **Version** : `1.0.0`
- **Build** : `1`

#### c) Onglet **Signing & Capabilities**

1. **Cocher** : ✅ Automatically manage signing
2. **Team** : Sélectionner votre compte Apple Developer
3. Ajouter les capabilities :
   - **Push Notifications**
   - **Background Modes** → cocher **Remote notifications**

---

### 3. Configurer les permissions

Ouvrir `ios/App/App/Info.plist` (clic droit → Open As → Source Code) :

```xml
<key>NSUserNotificationsUsageDescription</key>
<string>Salatrack a besoin d'envoyer des notifications pour vous rappeler vos prières.</string>

<key>NSMicrophoneUsageDescription</key>
<string>Salatrack utilise le micro pour jouer l'Adhan.</string>

<key>UIBackgroundModes</key>
<array>
    <string>remote-notification</string>
</array>
```

---

### 4. Générer les icônes et splash screens

**Option 1 : capacitor-assets**

```bash
npx capacitor-assets generate --ios
```

**Option 2 : Manuellement**

Placer une icône 1024x1024 dans :
```
ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

---

### 5. Tester sur un simulateur

1. Sélectionner un simulateur dans la barre d'outils Xcode (ex : iPhone 14)
2. Cliquer sur ▶️ **Run** (ou `Cmd + R`)

**Vérifier :**
- [ ] L'application s'ouvre sans crash
- [ ] La navigation fonctionne
- [ ] Les données sont sauvegardées

---

### 6. Tester sur un appareil physique

1. **Connecter votre iPhone** via USB
2. **Sélectionner votre appareil** dans la barre d'outils Xcode
3. **Cliquer sur ▶️ Run**

Si vous voyez une erreur **"Untrusted Developer"** sur l'iPhone :
1. **Paramètres** → **Général** → **VPN et gestion des appareils**
2. Appuyer sur votre compte développeur
3. **Faire confiance**

---

### 7. Créer une archive pour TestFlight / App Store

#### a) Sélectionner **Any iOS Device (arm64)** dans la barre d'outils

#### b) Menu : **Product** → **Archive**

Attendez que le build se termine (2-5 minutes).

#### c) Fenêtre **Archives** (s'ouvre automatiquement)

1. Sélectionner votre archive
2. Cliquer **Distribute App**
3. Sélectionner **App Store Connect**
4. Cliquer **Upload**
5. Suivre les étapes (signature automatique)

---

### 8. Vérifier l'upload sur App Store Connect

1. Aller sur [https://appstoreconnect.apple.com/](https://appstoreconnect.apple.com/)
2. **Mes apps** → **Salatrack**
3. **TestFlight** → Votre build devrait apparaître dans 5-10 minutes

---

## Publication Google Play Store

### 1. Créer un compte développeur

1. Aller sur [https://play.google.com/console](https://play.google.com/console)
2. **Créer un compte** (25 USD one-time payment)
3. Remplir les informations de votre organisation

---

### 2. Créer une nouvelle application

1. **Créer une application**
2. **Nom** : `Salatrack`
3. **Langue par défaut** : Français
4. **Type** : Application
5. **Gratuite ou payante** : Gratuite

---

### 3. Remplir la fiche du Store

#### a) Fiche du Store principale

- **Titre** : `Salatrack - Suivi des prières`
- **Description courte** (80 caractères max) :
  ```
  Suivez vos prières quotidiennes et recevez des rappels
  ```
- **Description complète** (4000 caractères max) :
  ```
  Salatrack vous aide à suivre vos 5 prières quotidiennes et à développer une routine spirituelle solide.
  
  Fonctionnalités :
  ✅ Suivi quotidien des 5 prières (Fajr, Dhuhr, Asr, Maghrib, Isha)
  ✅ Notifications personnalisables pour chaque prière
  ✅ Statistiques hebdomadaires et mensuelles
  ✅ Rappels d'adhkar (matin et soir)
  ✅ Mode hors ligne complet
  ✅ Interface simple et élégante
  
  Salatrack respecte votre vie privée : vos données restent sur votre appareil.
  ```

#### b) Captures d'écran

**Téléphone (obligatoire)** : 2-8 images (1080x1920 ou 1080x2340)
**Tablette 7 pouces** : optionnel
**Tablette 10 pouces** : optionnel

**Astuce** : Utilisez un simulateur Android + capture d'écran, ou votre téléphone.

#### c) Icône de l'application

- **Format** : PNG (512x512)
- **Avec transparence** : Non

#### d) Bannière graphique

- **Format** : PNG ou JPEG (1024x500)

---

### 4. Configurer le contenu

#### a) Classification du contenu

1. **Questionnaire** → Répondre aux questions (app de productivité/religion)
2. **Public cible** : Tous les âges

#### b) Coordonnées

- Email de contact
- Politique de confidentialité (URL) : `https://salatrack.app/privacy`
- Site web (optionnel) : `https://salatrack.app`

---

### 5. Uploader l'AAB

1. **Production** → **Créer une version**
2. **Uploader** votre `app-release.aab`
3. **Notes de version** :
   ```
   🎉 Première version de Salatrack !
   
   - Suivi des 5 prières quotidiennes
   - Notifications personnalisables
   - Statistiques complètes
   - Mode hors ligne
   ```

---

### 6. Soumettre pour révision

1. **Examiner la version**
2. **Envoyer pour révision**

**Délai de révision** : 1 à 7 jours (en moyenne 2-3 jours)

---

### 7. Vérifier l'état de la révision

Vous recevrez un email quand l'application sera approuvée ou rejetée.

**Raisons courantes de rejet** :
- Politique de confidentialité manquante ou incorrecte
- Permissions non justifiées
- Contenu inapproprié
- Bugs critiques

---

## Publication Apple App Store

### 1. Créer un compte Apple Developer

1. Aller sur [https://developer.apple.com/](https://developer.apple.com/)
2. **S'inscrire** au programme Apple Developer (99 USD/an)
3. Attendre la validation du compte (1-2 jours)

---

### 2. Créer un App ID

1. [https://developer.apple.com/account/resources/identifiers/](https://developer.apple.com/account/resources/identifiers/)
2. **+ (nouveau)** → **App IDs** → **App**
3. **Description** : `Salatrack`
4. **Bundle ID** : `com.salatrack.app` (doit correspondre à Xcode)
5. **Capabilities** :
   - ✅ Push Notifications
   - ✅ Background Modes
6. **Continuer** → **Register**

---

### 3. Créer l'app dans App Store Connect

1. [https://appstoreconnect.apple.com/](https://appstoreconnect.apple.com/)
2. **Mes apps** → **+ (nouvelle app)**
3. **Nom** : `Salatrack`
4. **Langue principale** : Français
5. **Bundle ID** : sélectionner `com.salatrack.app`
6. **SKU** : `salatrack-001` (unique, arbitraire)
7. **Accès utilisateur** : Accès complet
8. **Créer**

---

### 4. Remplir la fiche App Store

#### a) Informations générales

- **Nom** : `Salatrack`
- **Sous-titre** (30 caractères) : `Suivi des prières`
- **Catégorie principale** : Productivité
- **Catégorie secondaire** : Style de vie

#### b) Description

```
Salatrack vous aide à suivre vos 5 prières quotidiennes et à développer une routine spirituelle régulière.

FONCTIONNALITÉS :
• Suivi quotidien des 5 prières (Fajr, Dhuhr, Asr, Maghrib, Isha)
• Notifications personnalisables pour chaque prière
• Statistiques hebdomadaires et mensuelles
• Rappels d'adhkar (matin et soir)
• Mode hors ligne complet
• Interface simple et élégante

VIE PRIVÉE :
Vos données restent sur votre appareil. Aucune publicité, aucun tracking.

Développez une meilleure assiduité dans vos prières avec Salatrack. 🕌
```

#### c) Mots-clés (100 caractères max)

```
prière,islam,muslim,salat,tracker,rappel,adhkar,mosquée,spirituel,religieux
```

#### d) URL de support

```
https://salatrack.app/support
```

#### e) URL marketing (optionnel)

```
https://salatrack.app
```

---

### 5. Captures d'écran

**iPhone 6.7" (obligatoire)** : 1290x2796 (2-10 images)
**iPhone 6.5"** : 1284x2778
**iPhone 5.5"** : 1242x2208
**iPad Pro 12.9"** : 2048x2732 (si supporté)

**Astuce** : Utilisez le simulateur iOS + `Cmd + S` pour capturer l'écran.

---

### 6. Informations de version

#### a) Nouveautés (4000 caractères max)

```
🎉 Première version de Salatrack !

✅ Suivez vos 5 prières quotidiennes
✅ Recevez des notifications personnalisables
✅ Consultez vos statistiques détaillées
✅ Rappels d'adhkar matin et soir
✅ Fonctionne entièrement hors ligne
✅ Interface simple et intuitive

Commencez votre parcours spirituel avec Salatrack. 🕌
```

#### b) Classification par âge

- **4+** (adapté à tous)

---

### 7. Confidentialité

1. **Questionnaire sur la confidentialité**
2. **Données collectées** : Aucune (si vous ne collectez rien)
3. Ou indiquer les données collectées (email, prières) avec usage et finalité

---

### 8. Préparer pour soumission

#### a) Informations de contact

- Email de révision (pour Apple)
- Téléphone (optionnel)
- Notes pour les réviseurs (si connexion requise, fournir un compte de test)

#### b) Uploader le build

1. **Build** → Sélectionner votre build uploadé depuis Xcode
2. **Exporter les informations de conformité** :
   - Utilise le chiffrement : Non (si vous utilisez uniquement HTTPS standard)

---

### 9. Soumettre pour révision

1. **Envoyer pour révision**
2. **Délai de révision** : 1 à 7 jours (en moyenne 24-48h)

**Statuts possibles** :
- **En attente de révision**
- **En cours de révision**
- **Prêt pour la vente** ✅
- **Rejeté** ❌

---

### 10. Raisons courantes de rejet iOS

- Politique de confidentialité manquante
- Captures d'écran ne correspondant pas à l'app
- Fonctionnalités non fonctionnelles
- Contenu religieux inapproprié (rare si respectueux)
- Permissions non justifiées
- Bugs ou crashs

---

## Troubleshooting

### Android

#### Erreur : "SDK location not found"

**Solution** :
Créer `android/local.properties` :
```properties
sdk.dir=/Users/VotreNom/Library/Android/sdk
# Ou sur Windows :
sdk.dir=C:\\Users\\VotreNom\\AppData\\Local\\Android\\Sdk
```

---

#### Erreur : "Execution failed for task ':app:processReleaseResources'"

**Solution** :
```bash
cd android
./gradlew clean
./gradlew build --stacktrace
cd ..
```

---

#### Erreur : "INSTALL_FAILED_UPDATE_INCOMPATIBLE"

**Solution** :
Désinstaller l'ancienne version :
```bash
adb uninstall com.salatrack.app
```

---

### iOS

#### Erreur : "Code signing failed"

**Solution** :
1. Vérifier que le **Bundle ID** est correct
2. Vérifier que **Automatically manage signing** est coché
3. Vérifier que votre **Team** est sélectionné
4. Nettoyer le projet : **Product** → **Clean Build Folder**

---

#### Erreur : "No profiles for 'com.salatrack.app' were found"

**Solution** :
1. Aller sur [https://developer.apple.com/account/resources/profiles/](https://developer.apple.com/account/resources/profiles/)
2. Créer un nouveau **Provisioning Profile** pour votre App ID
3. Télécharger et double-cliquer pour installer
4. Redémarrer Xcode

---

#### Erreur : "Command PhaseScriptExecution failed"

**Solution** :
```bash
cd ios/App
rm -rf Pods
pod cache clean --all
pod install
cd ../..
```

---

#### Xcode : "Missing required icon file"

**Solution** :
Vérifier que toutes les tailles d'icônes sont présentes dans `ios/App/App/Assets.xcassets/AppIcon.appiconset/`.

---

## Checklist finale

### ✅ Avant de publier

#### Configuration générale
- [ ] Version `1.0.0` dans `package.json`
- [ ] Version `1.0.0` dans `android/app/build.gradle` (versionName)
- [ ] Version `1` dans `android/app/build.gradle` (versionCode)
- [ ] Version `1.0.0` dans Xcode (General → Version)
- [ ] Build `1` dans Xcode (General → Build)

#### Android
- [ ] Keystore sauvegardé dans un lieu sûr
- [ ] Mots de passe notés
- [ ] `applicationId` correct (`com.salatrack.app`)
- [ ] Permissions déclarées dans `AndroidManifest.xml`
- [ ] Icônes générées pour toutes les densités
- [ ] AAB signé et généré
- [ ] Testé sur au moins 2 appareils/émulateurs

#### iOS
- [ ] Bundle Identifier correct (`com.salatrack.app`)
- [ ] Signing configuré avec Team
- [ ] Capabilities ajoutées (Push Notifications, Background Modes)
- [ ] Permissions déclarées dans `Info.plist`
- [ ] Icônes générées (1024x1024 et toutes tailles)
- [ ] Archive uploadée sur App Store Connect
- [ ] Testé sur simulateur ET appareil physique

#### Stores
- [ ] Compte développeur Google Play créé (25 USD)
- [ ] Compte développeur Apple créé (99 USD/an)
- [ ] Captures d'écran préparées (Android + iOS)
- [ ] Icônes 512x512 (Android) et 1024x1024 (iOS)
- [ ] Description rédigée en français
- [ ] Politique de confidentialité publiée (URL)
- [ ] Email de support configuré
- [ ] Site web configuré (optionnel)

#### Tests fonctionnels
- [ ] Connexion / Inscription fonctionne
- [ ] Prières peuvent être ajoutées / modifiées / supprimées
- [ ] Notifications s'affichent correctement
- [ ] Audio Adhan fonctionne
- [ ] Statistiques s'affichent
- [ ] Mode hors ligne opérationnel
- [ ] Navigation fluide
- [ ] Aucun crash détecté

---

## 📚 Ressources utiles

### Documentation officielle
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

### Outils
- [Android Studio](https://developer.android.com/studio)
- [Xcode](https://developer.apple.com/xcode/)
- [Capacitor Assets Generator](https://github.com/ionic-team/capacitor-assets)
- [App Icon Generator](https://appicon.co/)

### Communautés
- [Capacitor Discord](https://discord.com/invite/UPYYRhtyzp)
- [Stack Overflow - Android](https://stackoverflow.com/questions/tagged/android)
- [Stack Overflow - iOS](https://stackoverflow.com/questions/tagged/ios)

---

## 🎉 Félicitations !

Vous avez maintenant toutes les informations nécessaires pour transformer Salatrack en applications natives Android et iOS.

**Temps estimé total** :
- Première fois : 10-15 heures
- Mises à jour suivantes : 1-2 heures

**Bon courage et qu'Allah facilite votre démarche ! 🤲**
