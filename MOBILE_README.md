# Salatracker Mobile App - Quick Start

## What is This?
Salatracker is a **Capacitor-based mobile app** - a React web app packaged as native iOS and Android applications.

**Not React Native**: This uses standard React (not React Native). It runs your web app in a native shell with access to native device features.

## ✅ Your App is Already Mobile-Ready!

All dependencies are installed:
- ✅ Capacitor 7.x
- ✅ iOS plugin
- ✅ Android plugin
- ✅ Local Notifications
- ✅ Push Notifications

## Quick Build Commands

### First Time Setup
```bash
# Add iOS platform (Mac only)
npx cap add ios

# Add Android platform (any OS)
npx cap add android
```

### Build & Run iOS
```bash
npm run mobile:ios
```
This will:
1. Build your web app
2. Sync to iOS project
3. Open Xcode
4. Then click Run ▶️ in Xcode

### Build & Run Android
```bash
npm run mobile:android
```
This will:
1. Build your web app
2. Sync to Android project
3. Open Android Studio
4. Then click Run ▶️ in Android Studio

### Just Sync (After Code Changes)
```bash
npm run mobile:sync
```

## What You Need

### For iOS (Mac Only)
- macOS computer
- Xcode (from App Store)
- Command Line Tools: `xcode-select --install`
- CocoaPods: `sudo gem install cocoapods`

### For Android (Any OS)
- Android Studio (download from developer.android.com)
- Java JDK 17+
- Android SDK (installed via Android Studio)

## Project Structure

```
├── src/                  # React app source code
├── dist/                 # Built web assets (generated)
├── ios/                  # iOS native project (generated)
├── android/              # Android native project (generated)
├── capacitor.config.ts   # Capacitor configuration
└── package.json          # Dependencies & scripts
```

## Current Configuration

**App ID**: `com.salatrack.app`
**App Name**: Salatrack
**Platforms**: iOS 13+ and Android 5+

**Features Enabled**:
- Local Notifications (prayer reminders)
- Push Notifications (remote updates)
- Native Splash Screen
- Safe Area support (notches, home indicators)

## How It Works

1. **You write React code** (what you're already doing)
2. **Vite builds it** to static HTML/CSS/JS
3. **Capacitor packages it** as iOS/Android apps
4. **Native shell runs it** with access to device features

## Backend & Data

**Already Configured**:
- ✅ Supabase Authentication
- ✅ Supabase Database (PostgreSQL)
- ✅ Supabase Edge Functions
- ✅ Real-time sync
- ✅ Offline support

**No Firebase needed** - Supabase provides everything:
- User authentication
- Database storage
- Serverless functions
- File storage
- Real-time updates

## Development Workflow

### Making Changes
1. Edit React code in `src/`
2. Test in browser: `npm run dev`
3. Build for mobile: `npm run build`
4. Sync to native: `npx cap sync`
5. Open in Xcode/Android Studio
6. Run on device/simulator

### Testing
- **Web**: `npm run dev` → Open browser
- **iOS**: `npm run mobile:ios` → Run in simulator
- **Android**: `npm run mobile:android` → Run in emulator

### Debugging
- **Web**: Browser DevTools
- **iOS**: Safari Web Inspector (Develop menu)
- **Android**: Chrome DevTools (chrome://inspect)

## Common Commands

```bash
# Development
npm run dev              # Start web dev server
npm run build            # Build for production

# Mobile
npm run mobile:sync      # Sync web assets to native
npm run mobile:ios       # Build & open iOS
npm run mobile:android   # Build & open Android

# Utilities
npm run lint             # Check code quality
npm run preview          # Preview production build
```

## Need Help?

📖 **Full Documentation**: `docs/mobile-build-guide.md`

**Common Issues**:
- White screen? Run `npm run build` first
- Changes not showing? Run `npm run mobile:sync`
- iOS team error? Select your team in Xcode Signing
- Android Gradle error? `cd android && ./gradlew clean`

## Architecture Summary

```
┌─────────────────────────────────────┐
│   React + Vite + TypeScript        │ ← You code here
│   (src/ directory)                  │
└──────────────┬──────────────────────┘
               │ builds to
               ▼
┌─────────────────────────────────────┐
│   Static Web Assets                 │
│   (dist/ directory)                 │
└──────────────┬──────────────────────┘
               │ packaged by
               ▼
      ┌────────┴────────┐
      ▼                 ▼
┌───────────┐    ┌──────────────┐
│ iOS App   │    │ Android App  │
│ (Xcode)   │    │ (Android     │
│           │    │  Studio)     │
└───────────┘    └──────────────┘
      │                 │
      └────────┬────────┘
               ▼
┌─────────────────────────────────────┐
│   Supabase Backend                  │
│   - Auth                            │
│   - PostgreSQL Database             │
│   - Edge Functions                  │
│   - Real-time                       │
└─────────────────────────────────────┘
```

## You're Ready! 🚀

Your app is already configured for mobile. Just run:

```bash
# iOS (Mac only)
npm run mobile:ios

# Android (any OS)
npm run mobile:android
```

The build is successful and everything is working. No additional configuration needed!
