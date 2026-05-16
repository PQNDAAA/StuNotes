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
import {TagsService} from "./tags/tags-service/tags-service";

@Injectable({
  providedIn: 'root',
})
export class App {

  constructor(private fcm: Fcm, private lns: LocalNotificationService, private cards: CardsService,
              private tagsService: TagsService, private cardsService: CardsService) {
  }

  async initApp() {
    await this.initNotifications();
    await this.checkTasks();
  }

  async initNotifications() {
    await this.checkLocalNotifications();
    this.fcm.initPush();
  }

  async initElements(){
    await this.tagsService.initTags();
    await this.cardsService.initCards();
  }

  async initAllElements(){
    await this.initElements();
    await this.initApp();
  }

  private async checkLocalNotifications() {
    await this.lns.initLocalNotifications();
  }

  private async checkTasks() {
    await this.cards.syncTaskReminders();
    await this.cards.syncOverdueTasks();
  }

}
