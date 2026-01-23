import {Component, OnInit} from '@angular/core';
import {SplashScreen} from "@capacitor/splash-screen";
import {Haptics} from "@capacitor/haptics";
import {Settings} from "./settings";
import {Platform} from "@ionic/angular";
import {NavigationBar} from "@capgo/capacitor-navigation-bar";
import {StatusBar, Style} from "@capacitor/status-bar";
import {Fcm} from "./fcm";
import {LocalNotificationService} from "./local-notification-service";
import {CardsService} from "./cards/cards-service/cards-service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private settingsService: Settings, private platform: Platform, private fcm: Fcm,
              private lns: LocalNotificationService, private cards : CardsService) {
    this.initializeApp();
  }

  ngOnInit() {
    this.settingsService.settingsHome$.subscribe(async data => {
      document.body.classList.toggle('dark', data.darkMode);
    });

   // this.initializeApp();
  }

 initializeApp() {
    //On attend que la plateforme (Android/iOS) soit prête
    this.platform.ready().then(() => {
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
  async showSplash(){
    await SplashScreen.show({
      showDuration: 3500,
      autoHide: true,
    });
  }






  async test(){
    if(this.platform.is('android')){
      // @ts-ignore
      await NavigationBar.setNavigationBarColor();
    }
  }

}
