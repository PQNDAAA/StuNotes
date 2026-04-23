import {Component, OnInit} from '@angular/core';
import {SplashScreen} from "@capacitor/splash-screen";
import {Settings} from "./settings/settings-service/settings";
import {Platform} from "@ionic/angular";
import {Fcm} from "./notifications/fcm/fcm";
import {LocalNotificationService} from "./notifications/service/local-notification-service";
import {CardsService} from "./cards/cards-service/cards-service";
import {LanguageService} from "./language/language-service/language-service";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsHome} from "./settings/settings-interface/isettings-home";
import {Api} from "./api/services/api";
import {SignupInterface} from "./auth/signup/interface/signup-interface";
import {Router} from "@angular/router";
import {firstValueFrom} from "rxjs";
import {FilterService} from "./home/filter/service/filter-service";
import {App} from "./app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  settings!: ISettingsHome;

  constructor(private settingsService: Settings, private platform: Platform, private translate: TranslateService,
              private languageService: LanguageService, private appService: App) {

    this.translate.addLangs(['fr','en']);
    this.checkApp();
  }

  async ngOnInit() {
    await this.initMainApp();

    this.settingsService.settingsHome$.subscribe(async data => {
      document.body.classList.toggle('dark', data.darkMode);
      this.settings = data;
    });

    if(this.settings.firstLaunch){
      //this.router.navigateByUrl('/first-launch', {replaceUrl:true});
      //this.settings.firstLaunch = false;
      //this.settingsService.changeSettingsValue(this.settings);
    }
  }

  checkApp(){
    this.platform.ready().then(() => {
      this.platform.resume.subscribe(async () => {
        await this.appService.checkToken();
        console.log("Reload de l'app fait.");
      });
    });
  }

 async initMainApp() {
    //On attend que la plateforme (Android/iOS) soit prête
   await this.platform.ready();
   await this.languageService.initLanguages();
   await this.appService.checkToken();

   setTimeout(async () => {
     await SplashScreen.hide({
       fadeOutDuration: 500 // Effet de fondu progressif très propre
     });
   }, 500);
  }
}
