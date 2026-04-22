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
              private languageService: LanguageService, private api: Api, private router : Router) {

    this.translate.addLangs(['fr','en']);
  }

  async ngOnInit() {

    await this.initializeMainApp();

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

 async initializeMainApp() {
    //On attend que la plateforme (Android/iOS) soit prête
   await this.platform.ready();
   await this.languageService.initLanguages();
   await this.checkToken();

   this.createUser({email:"1",username:"test1",password:"1234",dateOfBirthday:'12/12/2000'});

   setTimeout(async () => {
     await SplashScreen.hide({
       fadeOutDuration: 500 // Effet de fondu progressif très propre
     });
   }, 500);
  }

  async initializeApp(){
    await this.checkLocalNotifications();
    this.fcm.initPush();
    await this.checkTasks();
    console.log("token existant");
  }

  private async checkLocalNotifications(){
    await this.lns.initLocalNotifications();
  }

  private async checkTasks(){
    await this.cards.syncTaskReminders();
    await this.cards.syncOverdueTasks();
  }

  private async checkToken(){
    const token = localStorage.getItem("token");

    if(!token){
      await this.router.navigate(['/login']);
      console.log("Token not found");
      return;
    }

    try{
      const result = await firstValueFrom(this.api.getUserById());

      console.log(result);

      await this.initializeApp();
      await this.router.navigate(['/tabs']);
    } catch(error: any){
      if(error.status == 401){
        localStorage.removeItem("token");
        await this.router.navigate(['/login']);
      }
    }
  }

  private createUser(data: SignupInterface){
    this.api.createUser(data).subscribe(response => {
      console.log("Utilisateur crée avec succés: ",response);
    }, error => {
      console.error(error.error.message);
    })
  }
}
