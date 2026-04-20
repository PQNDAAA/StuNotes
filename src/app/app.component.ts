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
              private languageService: LanguageService, private api: Api) {

    this.translate.addLangs(['fr','en']);
  }

  async ngOnInit() {

    await this.initializeApp();

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

 async initializeApp() {
    //On attend que la plateforme (Android/iOS) soit prête
   await this.platform.ready();
   await this.languageService.initLanguages();
   await this.checkLocalNotifications();
   this.fcm.initPush();
   await this.checkTasks();

   this.createUser({email:"test",name:"test",password:"1234",age:12});

   setTimeout(async () => {
     await SplashScreen.hide({
       fadeOutDuration: 500 // Effet de fondu progressif très propre
     });
   }, 500);
  }

  private async checkLocalNotifications(){
    await this.lns.initLocalNotifications();
  }

  private async checkTasks(){
    await this.cards.syncTaskReminders();
    await this.cards.syncOverdueTasks();
  }

  private createUser(data: {email: string, name: string, password: string, age: number }){
    this.api.createUser(data).subscribe(response => {
      console.log("Utilisateur crée avec succés: ",response);
    }, error => {
      console.error(error.error.message);
    })
  }
}
