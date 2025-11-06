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
