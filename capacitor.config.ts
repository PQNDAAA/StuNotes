import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.dgsd.stunotes',
  appName: "Stu'Notes",
  webDir: 'www',

  //fr.dgsd.stunotes

  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: false,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: "launch_screen",
      useDialog: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      smallIcon: "ic_stat_ic_notification",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    SocialLogin: {
      providers: {
        google: true,      // true = enabled (bundled), false = disabled (not bundled)
        facebook: false,   // Use false to reduce app size
        apple: true,      // Apple uses system APIs, no external deps
        twitter: false   // false = disabled (not bundled)
      },
      logLevel: 1
    }
  },
};

export default config;
