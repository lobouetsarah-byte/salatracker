import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salatracker.app',
  appName: 'Salatracker',
  webDir: 'dist',
  backgroundColor: '#1e3a8a',
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#1e3a8a",
      sound: "adhan.mp3",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1e3a8a",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
};

export default config;
