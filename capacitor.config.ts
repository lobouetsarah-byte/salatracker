import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eb5850f6b56448dd8bc4c681675a0d22',
  appName: 'Salatrack',
  webDir: 'dist',
  server: {
    url: 'https://eb5850f6-b564-48dd-8bc4-c681675a0d22.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#10b981",
      sound: "adhan.mp3",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
