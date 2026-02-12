import {Component, OnInit} from '@angular/core';
import {SplashScreen} from "@capacitor/splash-screen";
import {Settings} from "./settings/settings-service/settings";
import {Platform} from "@ionic/angular";
import {Fcm} from "./notifications/fcm/fcm";
import {LocalNotificationService} from "./notifications/local-notification/local-notification-service";
import {CardsService} from "./cards/cards-service/cards-service";
import {LanguageService} from "./language/language-service/language-service";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsHome} from "./settings/settings-interface/isettings-home";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  settings!: ISettingsHome;

  constructor(private settingsService: Settings, private platform: Platform, private fcm: Fcm,
              private lns: LocalNotificationService, private cards : CardsService, private translate: TranslateService,
              private languageService: LanguageService, private router: Router) {

    this.translate.addLangs(['fr','en']);
    this.initializeApp();
  }

  ngOnInit() {
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

 initializeApp() {
    //On attend que la plateforme (Android/iOS) soit prête
    this.platform.ready().then(() => {
      this.languageService.initLanguages();
      this.fcm.initPush();
      this.checkLocalNotifications();
      this.checkOverdueTasks();


      setTimeout(async () => {
        await SplashScreen.hide({
          fadeOutDuration: 500 // Effet de fondu progressif très propre
        });
      }, 500);
    });
  }

  private async checkLocalNotifications(){
    await this.lns.initLocalNotifications();
  }

  private async checkOverdueTasks(){
    await this.cards.updateOverdueTasks();
  }

}
