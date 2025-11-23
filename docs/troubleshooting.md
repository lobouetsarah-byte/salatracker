# Troubleshooting Guide

## Common Issues and Solutions

### 1. Blank Screen / App Not Rendering

**Problem**: App shows a blank screen, green background, or doesn't render on mobile.

**Cause**: Multiple possible causes:
- CSS layout issues
- App initialization blocking render
- JavaScript errors preventing UI from mounting
- Missing error boundaries

**Solution**: ✅ **FIXED** - Complete startup flow overhaul:

**What Was Changed**:
1. **Splash Screen**: Now shows on startup and waits for actual auth initialization (not arbitrary timers)
2. **CSS Fixed**: Removed constraining styles from `#root` and `body` that prevented full-screen rendering
3. **Safe Areas**: Added proper iOS/Android safe area handling for notch/status bar
4. **Error Boundary**: Added comprehensive error handling to show error UI instead of blank screen
5. **Always Render**: App now always renders SOMETHING - splash, error, or main app
6. **Initialization Logic**: Changed from time-based to state-based (waits for Supabase auth to initialize)

**Startup Flow (Current)**:
1. **Initial Load**: Splash screen appears immediately
2. **Auth Init**: App waits for Supabase authentication to initialize (1-3 seconds typically)
3. **Success**: Splash fades out, main app appears
4. **Error**: After 30 seconds without init, shows error message with reload button
5. **Config Error**: If Supabase env vars missing, shows specific config error screen

**On Normal Startup You Should See**:
- Splash screen with logo and loading animation
- Brief loading (1-3 seconds)
- Splash fades out
- Main app appears

**On Config Error You Should See**:
- Red error card stating "Supabase configuration error"
- Instructions to check environment variables
- Never a blank screen

**On Network Error You Should See**:
- Splash screen with loading indicator
- After 30 seconds: "Loading too long" error message
- "Reload application" button to retry

**Code Locations**:
- `src/App.tsx` - Main app wrapper and startup logic
- `src/contexts/AuthContext.tsx` - Auth initialization
- `src/components/SplashScreen.tsx` - Splash screen component
- `src/components/ErrorBoundary.tsx` - Error handling
- `src/index.css` - CSS fixes for full-screen layout
- `src/App.css` - Root element styling

---

### 2. Missing Supabase Environment Variables Error

**Problem**: Console error: `Error: Missing Supabase environment variables`

**Cause**: Environment variables not loaded or mismatched Supabase credentials.

**Solution**: ✅ **FIXED** - Updated `.env` file with correct values:
```env
VITE_SUPABASE_PROJECT_ID="xoqtpirlztyemmiuktij"
VITE_SUPABASE_URL="https://xoqtpirlztyemmiuktij.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="[correct-key]"
VITE_SUPABASE_ANON_KEY="[correct-key]"
```

**Important**: All keys must match the same Supabase project!

**After Fixing**:
1. Run `npm run build`
2. Run `npm run mobile:sync` (for mobile apps)
3. Restart development server

---

### 3. App Not Updating on Mobile Device

**Problem**: Changes not appearing in iOS/Android app.

**Cause**: Need to rebuild and sync Capacitor.

**Solution**:
```bash
# Full rebuild and sync
npm run mobile:sync

# For iOS
npm run mobile:run:ios

# For Android
npm run mobile:run:android
```

**Important Steps**:
1. Make your code changes
2. Build: `npm run build`
3. Sync: `npx cap sync`
4. Reopen in Xcode/Android Studio
5. Clean build and run

---

### 4. Notifications Not Working

**Problem**: Prayer notifications not showing on mobile.

**Symptoms**:
- Notifications work on web but not mobile
- Permission granted but no notifications appear

**Solution**:

**For iOS**:
1. Check iOS capabilities in Xcode
2. Enable Push Notifications capability
3. Check device notification settings
4. Rebuild the app

**For Android**:
1. Check `AndroidManifest.xml` permissions
2. Verify notification channel creation
3. Check device battery optimization settings
4. Test on physical device (not all emulators support notifications)

**Code Check**:
- Native notifications: `src/hooks/useNativeNotifications.ts`
- Web notifications: `src/hooks/usePrayerNotifications.ts`
- Notification library: `src/lib/notifications.ts`

---

### 5. Location/Prayer Times Not Loading

**Problem**: Location shows "Loading..." or prayer times not displaying.

**Possible Causes**:
1. Geolocation permission denied
2. Network connectivity issues
3. Prayer times API not responding

**Solution**:

**Check Permissions**:
- Browser: Allow location access when prompted
- iOS: Settings → Your App → Location → While Using
- Android: Settings → Apps → Your App → Permissions → Location

**Check Network**:
- Verify internet connection
- Check if prayer times API is accessible
- Look for CORS errors in console

**Manual Location Mode**:
- App provides manual location entry as fallback
- Click location name → "Use manual location"
- Enter city, country, or coordinates

**Code Location**: `src/hooks/usePrayerTimes.ts`

---

### 6. Database Connection Errors

**Problem**: Data not saving or loading, Supabase errors in console.

**Symptoms**:
- "Failed to fetch" errors
- Authentication errors
- RLS policy errors

**Solution**:

**Check Environment Variables**:
```bash
# Verify .env file exists and has correct values
cat .env
```

**Verify Supabase Connection**:
1. Go to Supabase Dashboard
2. Check project status (should be active)
3. Verify API keys match `.env` file
4. Check database tables exist

**Check RLS Policies**:
- All tables should have RLS enabled
- User should be authenticated
- Policies should allow user to access their own data

**Test Queries**:
```typescript
// In browser console
const { data, error } = await supabase.from('profiles').select('*');
console.log(data, error);
```

---

### 7. Build Failures

**Problem**: `npm run build` fails with errors.

**Common Causes**:

**TypeScript Errors**:
```bash
# Check for type errors
npx tsc --noEmit
```

**Missing Dependencies**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Cache Issues**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

**Module Resolution**:
- Check import paths use `@/` alias correctly
- Verify all imported files exist
- Check for circular dependencies

---

### 8. iOS Build Issues

**Problem**: Can't build for iOS, errors in Xcode.

**Common Issues**:

**Cocoapods**:
```bash
cd ios/App
pod install
pod update
```

**Signing & Capabilities**:
1. Open Xcode
2. Select project → Targets → App
3. Signing & Capabilities
4. Select your team
5. Enable required capabilities:
   - Push Notifications
   - Background Modes

**Deployment Target**:
- Minimum iOS version: 13.0
- Check in `capacitor.config.ts`

**Clean Build**:
1. Xcode → Product → Clean Build Folder
2. Delete DerivedData
3. Rebuild

---

### 9. Android Build Issues

**Problem**: Can't build for Android, Gradle errors.

**Common Issues**:

**Gradle Sync**:
```bash
cd android
./gradlew clean
./gradlew build
```

**SDK/NDK Issues**:
1. Open Android Studio
2. Tools → SDK Manager
3. Install required SDK versions
4. Install NDK

**Permissions**:
- Check `AndroidManifest.xml`
- Required permissions should be declared
- Internet, Location, Notifications

**Build Configuration**:
- Check `build.gradle` files
- Verify minSdkVersion: 22
- Verify targetSdkVersion: 34

---

### 10. Performance Issues

**Problem**: App is slow or laggy.

**Solutions**:

**Enable Production Mode**:
```bash
npm run build  # Uses production mode
```

**Check Bundle Size**:
- Main bundle: ~800KB (current)
- Consider code-splitting if needed
- Use dynamic imports for large components

**Optimize Images**:
- Use WebP format
- Compress images
- Use appropriate sizes

**Database Queries**:
- Add indexes for frequently queried columns
- Use pagination for large datasets
- Cache frequent queries in app

---

## Debug Mode

### Enable Verbose Logging

**Browser Console**:
```javascript
// Enable all logs
localStorage.setItem('debug', '*');

// Enable specific logs
localStorage.setItem('debug', 'supabase:*');
```

**React DevTools**:
1. Install React DevTools extension
2. Open DevTools → Components
3. Inspect component state and props

**Network Inspection**:
1. Open DevTools → Network
2. Filter by XHR/Fetch
3. Check Supabase API calls
4. Verify request/response data

---

## Getting Help

### Information to Provide

When reporting an issue, include:

1. **Environment**:
   - Platform (Web/iOS/Android)
   - Browser/Device details
   - App version

2. **Error Details**:
   - Console error messages
   - Screenshots
   - Steps to reproduce

3. **What You Tried**:
   - Solutions attempted
   - Configuration checked

4. **Logs**:
   - Browser console output
   - Xcode console (iOS)
   - Logcat (Android)

### Useful Commands

```bash
# Check app version
npm run --version

# View all logs (iOS)
npx cap run ios -l

# View all logs (Android)
npx cap run android -l

# Open project in IDE
npx cap open ios
npx cap open android

# Verify Capacitor config
npx cap doctor

# Update Capacitor
npx cap update
```

---

## Quick Fixes Checklist

When something isn't working:

- [ ] Clear browser cache and reload
- [ ] Check console for errors
- [ ] Verify `.env` file exists and is correct
- [ ] Rebuild: `npm run build`
- [ ] Sync mobile: `npm run mobile:sync`
- [ ] Restart development server
- [ ] Check internet connection
- [ ] Verify Supabase project is active
- [ ] Check device permissions (location, notifications)
- [ ] Try on different device/browser
- [ ] Check Supabase Dashboard for issues

---

## Prevention Tips

**Best Practices**:
1. Always run `npm run build` after changes
2. Sync Capacitor after every build
3. Test on physical devices, not just emulators
4. Keep dependencies updated
5. Monitor Supabase usage/quotas
6. Regular database backups
7. Test authentication flows thoroughly
8. Handle network errors gracefully

**Development Workflow**:
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build
npm run build

# 4. Test production build
npm run preview

# 5. Sync to mobile
npm run mobile:sync

# 6. Test on device
npm run mobile:run:ios
# or
npm run mobile:run:android
```

---

## Still Having Issues?

1. Check all documentation in `/docs/` folder
2. Review error logs carefully
3. Search Supabase/Capacitor documentation
4. Check GitHub issues for similar problems
5. Test with minimal reproduction case

**Key Documentation**:
- `MOBILE_README.md` - Quick start
- `mobile-build-guide.md` - Complete build instructions
- `database-management.md` - Database help
- `notification-system.md` - Notification debugging
- `implementation-summary.md` - Feature overview
