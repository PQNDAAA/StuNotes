import {Injectable} from '@angular/core';
import {Api} from "./api/services/api";
import {Settings} from "./settings/settings-service/settings";
import {Platform} from "@ionic/angular";
import {Fcm} from "./notifications/fcm/fcm";
import {LocalNotificationService} from "./notifications/service/local-notification-service";
import {CardsService} from "./cards/cards-service/cards-service";
import {TranslateService} from "@ngx-translate/core";
import {LanguageService} from "./language/language-service/language-service";
import {Router} from "@angular/router";
import {FilterService} from "./home/filter/service/filter-service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class App {

  constructor(private fcm: Fcm, private lns: LocalNotificationService, private cards: CardsService,
              private api: Api, private router: Router) {
  }

  async initApp() {
    await this.checkLocalNotifications();
    this.fcm.initPush();
    await this.checkTasks();
    console.log("Token existing");
  }

  private async checkLocalNotifications() {
    await this.lns.initLocalNotifications();
  }

  private async checkTasks() {
    await this.cards.syncTaskReminders();
    await this.cards.syncOverdueTasks();
  }

  async checkToken() {
    const token = localStorage.getItem("token");

    if (!token) {
      await this.router.navigate(['/landing']);
      console.log("Token not found");
      return;
    }

    this.api.getUserById().subscribe(async response => {
      const str = JSON.stringify(response);
      const value = JSON.parse(str);

      if (!value) {
        localStorage.removeItem("token");
        await this.router.navigate(['/login']);
      } else {
        await this.initApp();
        await this.router.navigate(['/tabs']);
      }
    }, async error => {
      if (error.status == 401) {
        localStorage.removeItem("token");
        await this.router.navigate(['/login']);
      }
    });
  }

}
