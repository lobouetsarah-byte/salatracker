# App Store Submission Guide - Salatrack

## App Information

### Basic Details
- **App Name**: Salatrack
- **Bundle ID**: com.salatrack.app
- **Version**: 1.0.0
- **Category**: Lifestyle / Productivity
- **Content Rating**: 4+
- **Languages**: French (primary), English support
- **Orientation**: Portrait preferred (landscape allowed)

### App Description

**Short Description (80 characters)**:
Prayer tracking app with smart reminders for daily Islamic prayers

**Full Description**:
Salatrack is your daily companion for tracking Islamic prayers (Salat). Never miss a prayer with intelligent notifications and comprehensive tracking features.

**Key Features**:
✅ Automatic prayer times based on your location
✅ Smart notifications for each prayer
✅ Daily prayer tracking with on-time, late, and missed status
✅ Dhikr (remembrance) tracking after each prayer
✅ Period mode for women with alternative spiritual activities
✅ Weekly and monthly statistics
✅ Achievement badges and motivation system
✅ Beautiful, modern interface with period-mode theme
✅ Offline support with PWA technology
✅ Privacy-first: your data stays with you

**Perfect for**:
- Muslims who want to improve their prayer consistency
- Anyone seeking to build a strong spiritual routine
- Users who appreciate beautiful, intuitive app design
- People who want private, secure prayer tracking

**Privacy & Data**:
- All data stored securely in your account
- No third-party tracking
- Optional authentication
- Works offline

**Technical Features**:
- Accurate prayer times using Aladhan API
- Automatic location detection (with permission)
- Manual location entry option
- Local notifications (no internet required)
- Native iOS performance
- Respects device battery optimization

### Keywords
prayer, salat, islam, muslim, prayer times, adhan, athan, dhikr, quran, ramadan, islamic app, halal, mosque, spirituality

---

## Technical Requirements

### iOS Requirements
- **Minimum iOS Version**: 13.0
- **Target iOS Version**: 17.0
- **Devices**: iPhone, iPad
- **Architecture**: arm64
- **Orientation**: Portrait (primary), Landscape (supported)

### Permissions Required
1. **Location (When In Use)** - Required
   - Purpose: Calculate accurate prayer times for user's location
   - Usage: Only when app is open
   - Can be denied: Yes (manual location entry available)

2. **Notifications** - Required
   - Purpose: Prayer time reminders
   - Usage: Scheduled local notifications
   - Can be denied: Yes (app still functional)

### Capabilities Needed in Xcode
- ✅ Push Notifications (Local notifications)
- ✅ Background Modes → Remote notifications
- ✅ App Groups (if using shared storage)

---

## Build Instructions

### Prerequisites
```bash
# Ensure you have:
- Node.js 18+ installed
- npm or pnpm package manager
- Xcode 15+ (for iOS)
- CocoaPods installed
- Valid Apple Developer account
```

### Step 1: Environment Setup
```bash
# Clone/navigate to project
cd salatrack

# Install dependencies
npm install

# Create production environment file
cat > .env.production << EOF
VITE_SUPABASE_URL="https://wblhybuyhlpbonojgpav.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndibGh5YnV5aGxwYm9ub2pncGF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MjA1ODcsImV4cCI6MjA3OTQ5NjU4N30.8kBbmcicHcIlfZrS45XpL2pgxtFN5NzYe9IT7SvIG0I"
EOF
```

### Step 2: Build for Production
```bash
# Build optimized production bundle
npm run build

# Verify build succeeded
ls -lh dist/
```

### Step 3: Sync to iOS
```bash
# Sync web assets to iOS
npx cap sync ios

# Or use the convenience script
npm run mobile:sync
```

### Step 4: Open in Xcode
```bash
# Open iOS project in Xcode
npx cap open ios

# Or manually open:
open ios/App/App.xcworkspace
```

### Step 5: Xcode Configuration

#### General Tab
1. **Display Name**: Salatrack
2. **Bundle Identifier**: com.salatrack.app
3. **Version**: 1.0.0
4. **Build**: 1
5. **Deployment Target**: iOS 13.0
6. **Devices**: Universal (iPhone + iPad)

#### Signing & Capabilities
1. **Team**: Select your Apple Developer team
2. **Signing**: Automatic signing enabled
3. **Capabilities**:
   - ✅ Push Notifications
   - ✅ Background Modes → Remote notifications

#### Info Tab
Verify these keys are present (already configured in Info.plist):
- ✅ NSLocationWhenInUseUsageDescription
- ✅ NSUserNotificationsUsageDescription
- ✅ UIBackgroundModes
- ✅ UIUserInterfaceStyle: Light

#### Build Settings
- **Marketing Version**: 1.0.0
- **Current Project Version**: 1
- **iOS Deployment Target**: 13.0

### Step 6: Archive and Upload

#### Create Archive
1. In Xcode: Product → Archive
2. Wait for build to complete
3. Organizer window opens automatically

#### Validate Archive
1. Select your archive
2. Click "Validate App"
3. Choose App Store Connect
4. Let Xcode perform validation
5. Fix any issues reported

#### Upload to App Store Connect
1. Click "Distribute App"
2. Choose "App Store Connect"
3. Select "Upload"
4. Follow prompts to upload
5. Wait for processing (10-30 minutes)

---

## App Store Connect Setup

### App Information

#### Primary Details
- **Name**: Salatrack
- **Subtitle**: Daily Prayer Tracker
- **Privacy Policy URL**: https://salatrack.app/privacy
- **Category**: Lifestyle (Primary), Productivity (Secondary)
- **Content Rights**: You own or have rights to all content

#### Pricing
- **Price**: Free
- **In-App Purchases**: None (currently)

#### App Privacy

**Data Collection**:
1. **Location** (Optional)
   - Used for: App Functionality (prayer times)
   - Linked to User: No
   - Used for Tracking: No

2. **User ID** (Optional - only if signed in)
   - Used for: App Functionality
   - Linked to User: Yes
   - Used for Tracking: No

3. **Prayer Data** (Optional - only if signed in)
   - Used for: App Functionality
   - Linked to User: Yes
   - Used for Tracking: No

**Privacy Practices**:
- ✅ Optional authentication
- ✅ Data used only for app functionality
- ✅ No third-party tracking
- ✅ No data sold to third parties
- ✅ Data encrypted in transit and at rest

### Screenshots Required

**iPhone 6.7" (Pro Max)**:
- 1290 x 2796 pixels
- 5-10 screenshots showing:
  1. Prayer times overview
  2. Prayer tracking interface
  3. Statistics dashboard
  4. Settings and customization
  5. Notifications preview

**iPhone 5.5" (Plus)**:
- 1242 x 2208 pixels
- Same content as 6.7" scaled

**iPad Pro 12.9" (3rd gen)**:
- 2048 x 2732 pixels
- Same content optimized for iPad

### App Preview (Optional but Recommended)
- 30-second video showing app functionality
- Portrait orientation
- Show key features: prayer times, tracking, notifications

---

## Checklist Before Submission

### Code & Build
- [x] Production build succeeds without errors
- [x] Version number incremented
- [x] Bundle ID matches App Store Connect
- [x] All assets included (icons, splash screens)
- [x] Code optimized and minified
- [x] Source maps disabled for production
- [x] Environment variables set correctly

### Functionality
- [x] App launches without crashing
- [x] Prayer times calculate correctly
- [x] Notifications work properly
- [x] Location permission handled gracefully
- [x] Manual location entry works
- [x] Offline mode functional
- [x] No console errors in production
- [x] Period mode working correctly
- [x] All tabs and navigation work
- [x] Authentication flow works

### iOS Specific
- [x] Safe areas respected (notch, home indicator)
- [x] Status bar styled correctly
- [x] Launch screen displays
- [x] All orientations handled
- [x] Back swipe gesture works
- [x] Keyboard handling correct
- [x] System alerts styled properly

### Compliance
- [x] Privacy policy URL valid
- [x] Terms of service available
- [x] No offensive content
- [x] Permissions properly described
- [x] Age rating appropriate (4+)
- [x] Content complies with guidelines

### App Store Connect
- [x] App created in App Store Connect
- [x] Bundle ID registered
- [x] Certificates and profiles configured
- [x] Screenshots prepared (all sizes)
- [x] App description written
- [x] Keywords selected
- [x] Support URL provided
- [x] Contact information correct

---

## Common Issues & Solutions

### Build Fails
- Clean build folder: Product → Clean Build Folder
- Delete DerivedData: `rm -rf ~/Library/Developer/Xcode/DerivedData`
- Reinstall pods: `cd ios/App && pod install`

### Archive Not Appearing
- Ensure "Generic iOS Device" selected (not simulator)
- Check deployment target matches
- Verify signing is configured

### Upload Fails
- Check for missing compliance info
- Verify export options are correct
- Try uploading via Transporter app

### Validation Errors
- Read error messages carefully
- Common issues:
  - Missing icons
  - Invalid bundle ID
  - Capabilities mismatch
  - Privacy descriptions missing

---

## Post-Submission

### Review Process
- **Typical timeline**: 24-48 hours
- **Status tracking**: App Store Connect → My Apps → Your App
- **Notifications**: Email updates on status changes

### During Review
- Keep app functional
- Monitor for rejection reasons
- Respond promptly to reviewer questions

### If Rejected
1. Read rejection reason carefully
2. Fix issues mentioned
3. Submit new build with fixes
4. Add notes explaining changes

### After Approval
1. App goes live automatically (or scheduled)
2. Monitor crash reports
3. Respond to user reviews
4. Plan updates based on feedback

---

## Maintenance & Updates

### Regular Updates
- Bug fixes: Submit as needed
- Feature updates: Monthly/quarterly
- OS compatibility: After new iOS releases
- Security updates: Immediately

### Version Numbering
- Major: 1.0.0 → 2.0.0 (major features)
- Minor: 1.0.0 → 1.1.0 (new features)
- Patch: 1.0.0 → 1.0.1 (bug fixes)

### Update Checklist
1. Increment version in package.json
2. Update MARKETING_VERSION in Xcode
3. Increment CURRENT_PROJECT_VERSION
4. Update changelog/release notes
5. Build, test, and submit

---

## Support Resources

### Apple Resources
- [App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

### Capacitor Resources
- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

### Project Resources
- Technical docs: `/docs/` folder
- Troubleshooting: `/docs/troubleshooting.md`
- Quick start: `/docs/QUICK_START.md`

---

## Contact & Support

**Developer Support**:
- Email: support@salatrack.app
- Website: https://salatrack.app

**Technical Issues**:
- Check `/docs/troubleshooting.md`
- Review GitHub issues
- Contact development team

---

**Last Updated**: 2025-11-24
**App Version**: 1.0.0
**Document Version**: 1.0
