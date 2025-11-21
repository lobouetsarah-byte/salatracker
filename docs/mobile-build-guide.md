# Mobile App Build Guide

## Overview
Salatracker is built using **Capacitor**, which packages your React web app as native iOS and Android applications. This is NOT React Native - it's a web app running in a native shell with access to native APIs.

## Architecture
- **Framework**: React 18 + Vite
- **Mobile Bridge**: Capacitor 7.x
- **Platforms**: iOS and Android
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Notifications**: Capacitor Local Notifications + Push Notifications

## Prerequisites

### For iOS Development
- **macOS**: Required for iOS builds
- **Xcode**: Latest version (15.0+)
  - Download from Mac App Store
  - Install Command Line Tools: `xcode-select --install`
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Device/Simulator**: For testing

### For Android Development
- **Any OS**: Windows, macOS, or Linux
- **Android Studio**: Latest version
  - Download from https://developer.android.com/studio
  - Install Android SDK (API 33 or higher)
  - Configure environment variables:
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
- **Java JDK**: Version 17 or higher
- **Android Device/Emulator**: For testing

### General Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control

## Initial Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Mobile Platforms (First Time Only)
```bash
# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android
```

This creates `ios/` and `android/` folders with native project files.

## Build Commands

### Quick Reference
```bash
# Sync web assets to mobile platforms
npm run mobile:sync

# Open iOS project in Xcode
npm run mobile:ios

# Open Android project in Android Studio
npm run mobile:android

# Run on iOS device/simulator
npm run mobile:run:ios

# Run on Android device/emulator
npm run mobile:run:android
```

### Detailed Build Process

#### Build for iOS
1. **Build web assets**:
   ```bash
   npm run build
   ```

2. **Sync to iOS**:
   ```bash
   npx cap sync ios
   ```

3. **Open in Xcode**:
   ```bash
   npx cap open ios
   ```

4. **Configure in Xcode**:
   - Select your development team
   - Choose a signing certificate
   - Select target device/simulator
   - Click "Run" (▶️ button)

#### Build for Android
1. **Build web assets**:
   ```bash
   npm run build
   ```

2. **Sync to Android**:
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Configure in Android Studio**:
   - Wait for Gradle sync to complete
   - Select target device/emulator
   - Click "Run" (▶️ button)

## Configuration

### App Configuration (`capacitor.config.ts`)
```typescript
{
  appId: 'com.salatrack.app',      // Unique app identifier
  appName: 'Salatrack',            // App display name
  webDir: 'dist',                  // Built web assets directory
  backgroundColor: '#0c3b2e',      // App background color
}
```

### iOS-Specific Settings
```typescript
ios: {
  contentInset: 'always',          // Respects safe areas
  scheme: 'Salatrack',             // URL scheme for deep linking
}
```

### Android-Specific Settings
```typescript
android: {
  allowMixedContent: false,        // Enforces HTTPS
  captureInput: true,              // Captures keyboard input
  webContentsDebuggingEnabled: false, // Disables debugging in production
}
```

### Plugins Configuration
```typescript
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
}
```

## Native Plugins Used

### 1. Local Notifications
**Purpose**: Prayer time reminders and notifications

**Usage in Code**:
```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

// Schedule a notification
await LocalNotifications.schedule({
  notifications: [
    {
      title: "Prayer Time",
      body: "It's time for Fajr",
      id: 1,
      schedule: { at: new Date(Date.now() + 1000 * 60) },
      sound: 'adhan.mp3',
      smallIcon: 'ic_stat_icon_config_sample',
    }
  ]
});
```

**Files**:
- `/src/hooks/useNativeNotifications.ts`
- `/src/hooks/usePrayerNotifications.ts`

### 2. Push Notifications
**Purpose**: Remote notifications from server

**Usage in Code**:
```typescript
import { PushNotifications } from '@capacitor/push-notifications';

// Register for push notifications
const result = await PushNotifications.requestPermissions();
if (result.receive === 'granted') {
  await PushNotifications.register();
}
```

### 3. Capacitor Core
**Purpose**: Native device detection and app lifecycle

**Usage in Code**:
```typescript
import { Capacitor } from '@capacitor/core';

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform(); // 'ios' or 'android'
```

**Files**: Throughout the codebase where platform detection is needed

## Mobile-Specific Features

### 1. Safe Area Handling
The app respects device safe areas (notches, home indicators):

```css
/* In CSS */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
```

```jsx
// In JSX
<div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
  Content
</div>
```

### 2. Native Splash Screen
- Configured in `capacitor.config.ts`
- 2-second duration
- Green background (#0c3b2e)
- No spinner (custom splash implemented in React)

### 3. Deep Linking
- URL scheme: `salatrack://`
- Configured for password reset flows
- Opens app from external links

### 4. Offline Support
- Service Worker caching
- Supabase offline-first data sync
- Local storage for auth state

## Platform-Specific Files

### iOS Files (`ios/` directory)
- `App/App/Info.plist` - App permissions and settings
- `App/App/Assets.xcassets` - App icons and launch images
- `App/App.xcodeproj` - Xcode project file
- `Podfile` - CocoaPods dependencies

### Android Files (`android/` directory)
- `app/src/main/AndroidManifest.xml` - App permissions and settings
- `app/src/main/res/` - Resources (icons, strings)
- `app/build.gradle` - App-level build configuration
- `build.gradle` - Project-level build configuration

## Permissions

### iOS Permissions (Info.plist)
Add these to `ios/App/App/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to calculate accurate prayer times</string>

<key>NSNotificationsUsageDescription</key>
<string>We send notifications for prayer times</string>
```

### Android Permissions (AndroidManifest.xml)
Add these to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

## Testing

### iOS Testing
1. **Simulator**:
   - Fast, no device needed
   - Limited hardware features (no camera, notifications may not work)
   - Run: `npm run mobile:run:ios`

2. **Physical Device**:
   - Connect via USB
   - Enable Developer Mode in Settings
   - Select device in Xcode
   - Full hardware features

### Android Testing
1. **Emulator**:
   - Create AVD in Android Studio
   - Run: `npm run mobile:run:android`

2. **Physical Device**:
   - Enable USB Debugging in Developer Options
   - Connect via USB
   - Select device in Android Studio
   - Full hardware features

## Debugging

### iOS Debugging
1. **Safari Web Inspector**:
   - Enable Develop menu in Safari preferences
   - Connect device via USB
   - Safari > Develop > [Device] > [App]
   - Full Chrome DevTools-like experience

2. **Xcode Console**:
   - View native logs
   - See crash reports
   - Monitor performance

### Android Debugging
1. **Chrome DevTools**:
   - Open Chrome
   - Navigate to `chrome://inspect`
   - Select your device
   - Full DevTools experience

2. **Android Studio Logcat**:
   - View native logs
   - Filter by app
   - Monitor performance

### Remote Debugging
```bash
# iOS
npx cap open ios
# Then use Safari Web Inspector

# Android
npx cap open android
# Then use Chrome DevTools
```

## Building for Production

### iOS Production Build
1. **Archive in Xcode**:
   - Product > Archive
   - Wait for build to complete
   - Click "Distribute App"

2. **Choose Distribution Method**:
   - App Store Connect (for App Store)
   - Ad Hoc (for testing)
   - Enterprise (for internal distribution)

3. **Upload to App Store**:
   - Follow Xcode prompts
   - Wait for processing
   - Submit for review

### Android Production Build
1. **Generate Signed APK/Bundle**:
   - Build > Generate Signed Bundle/APK
   - Choose Android App Bundle (recommended)
   - Create/select keystore
   - Set release configuration

2. **Upload to Play Console**:
   - Go to Google Play Console
   - Create/select app
   - Upload AAB file
   - Fill in store listing
   - Submit for review

## Environment Configuration

### Production URLs
Update in production build:
```typescript
// capacitor.config.ts
server: {
  url: 'https://salatrack.app',  // Your production domain
  cleartext: false                // Force HTTPS
}
```

### Environment Variables
Create `.env.production`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

Build with production env:
```bash
npm run build --mode production
```

## Common Issues & Solutions

### Issue: "No development team selected"
**Solution**: In Xcode, select your team in Signing & Capabilities

### Issue: Android Gradle sync failed
**Solution**:
```bash
cd android
./gradlew clean
cd ..
npm run mobile:sync
```

### Issue: White screen on launch
**Solution**:
1. Check `dist/` folder exists and has files
2. Run `npm run build` first
3. Check Capacitor config `webDir: 'dist'`

### Issue: Notifications not working
**Solution**:
1. Check permissions are granted
2. Test on real device (not simulator)
3. Verify notification permissions in settings

### Issue: Changes not reflected in app
**Solution**:
```bash
npm run build
npx cap sync
```
Then rebuild in Xcode/Android Studio

## Performance Optimization

### 1. Code Splitting
```typescript
// Use dynamic imports
const Settings = lazy(() => import('./pages/Settings'));
```

### 2. Asset Optimization
- Compress images before including
- Use WebP format for images
- Lazy load images

### 3. Bundle Size
- Current bundle: ~800 KB (acceptable for mobile)
- Monitor with `npm run build`
- Consider code splitting if grows larger

## Deployment Checklist

### Pre-Deployment
- [ ] Update version number in `package.json`
- [ ] Update version/build number in native projects
- [ ] Test on both iOS and Android
- [ ] Test on different screen sizes
- [ ] Verify all features work offline
- [ ] Check notification permissions
- [ ] Test deep linking
- [ ] Verify authentication flows
- [ ] Check API endpoints (production URLs)

### App Store Requirements
- [ ] App icon (all sizes)
- [ ] Screenshots (all device sizes)
- [ ] App description
- [ ] Privacy policy URL
- [ ] App category
- [ ] Age rating

### Play Store Requirements
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone + tablet)
- [ ] Short description (80 chars)
- [ ] Full description
- [ ] Privacy policy URL
- [ ] Content rating

## Continuous Integration

### GitHub Actions Example
```yaml
name: Build Mobile Apps

on: [push]

jobs:
  build:
    runs-on: macos-latest

    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '18'

    - run: npm install
    - run: npm run build
    - run: npx cap sync ios
    - run: npx cap sync android
```

## Support & Resources

### Official Documentation
- Capacitor: https://capacitorjs.com/docs
- iOS: https://developer.apple.com/documentation
- Android: https://developer.android.com/docs

### Community
- Capacitor Discord: https://ionic.link/discord
- Stack Overflow: Tag `capacitor`

### Tools
- Capacitor Doctor: `npx cap doctor` (checks setup)
- Capacitor Update: `npm install @capacitor/cli@latest`

## Summary

Your Salatracker app is a **hybrid mobile app** using:
- ✅ React + Vite for the web layer
- ✅ Capacitor for native iOS/Android packaging
- ✅ Supabase for backend (auth + database)
- ✅ Native plugins for notifications and device features

This architecture gives you:
- Single codebase for iOS, Android, and web
- Native performance with web development speed
- Full access to native APIs
- Easy updates (web updates instantly, native for major changes)

**You're ready to build mobile apps!** Use the commands in the Quick Reference section to get started.
