import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.dgsd.stunotes',
  appName: "Stu'Notes",
  webDir: 'www',

  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // durée d’affichage en ms
      launchAutoHide: true,     // se cache automatiquement
      backgroundColor: "#FFFFFFFF", // couleur de fond
      androidScaleType: 'CENTER_INSIDE',
      splashFullScreen: true,   // mode plein écran
      splashImmersive: false,    // cacher la barre système
    },
  },
};

export default config;
