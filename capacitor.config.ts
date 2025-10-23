import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.dgsd.stunotes',
  appName: "Stu'Notes",
  webDir: 'www',

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000, // durée d’affichage en ms
      launchAutoHide: true,     // se cache automatiquement
      backgroundColor: "#FFFFFFFF", // couleur de fond
      showSpinner: false,       // désactiver le spinner
      splashFullScreen: true,   // mode plein écran
      splashImmersive: true,    // cacher la barre système
    },
  },
};

export default config;
