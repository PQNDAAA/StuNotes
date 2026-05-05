import {Component, OnInit} from '@angular/core';
import {SplashScreen} from "@capacitor/splash-screen";
import {Settings} from "./settings/settings-service/settings";
import {Platform} from "@ionic/angular";
import {LanguageService} from "./language/language-service/language-service";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsHome} from "./settings/settings-interface/isettings-home";
import {App} from "./app";
import {SocialLogin} from "@capgo/capacitor-social-login";
import {Capacitor} from "@capacitor/core";
import {Auth} from "./auth/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  settings!: ISettingsHome;

  constructor(private settingsService: Settings, private platform: Platform, private translate: TranslateService,
              private languageService: LanguageService, private appService: App, private authService: Auth) {

    this.translate.addLangs(['fr', 'en']);
    this.checkApp();
  }

  async ngOnInit() {
    await this.initMainApp();

    this.settingsService.settingsHome$.subscribe(async data => {
      document.body.classList.toggle('dark', data.darkMode);
      this.settings = data;
    });
  }

  checkApp() {
    this.platform.ready().then(() => {
      this.platform.resume.subscribe(async () => {
        if(this.authService.loginInProgress) return;
        await this.appService.checkToken();
        console.log("Reload de l'app fait.");
      });
    });
  }

  async initMainApp() {
    //On attend que la plateforme (Android/iOS) soit prête
    await this.platform.ready();
    await this.languageService.initLanguages();

    await SocialLogin.initialize({
      google: {
        webClientId: '257842785862-3uq9f88k9fhds7tl8d07otkqu9av930p.apps.googleusercontent.com',
        iOSClientId: '257842785862-lrur566dp7g9di4s97u9jbj4jmfirejg.apps.googleusercontent.com',
      },

      apple: Capacitor.getPlatform() === 'ios' ? {} : undefined
    });
    await this.appService.checkToken();

    setTimeout(async () => {
      await SplashScreen.hide({
        fadeOutDuration: 500 // Effet de fondu progressif très propre
      });
    }, 500);
  }
}
