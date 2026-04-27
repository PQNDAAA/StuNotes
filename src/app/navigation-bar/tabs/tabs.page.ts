import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {Router} from "@angular/router";
import {SettingsPage} from "../../settings/settings.page";
import {CardsService} from "../../cards/cards-service/cards-service";
import {LocalNotifications} from "@capacitor/local-notifications";
import {Api} from "../../api/services/api";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private mc : ModalController, private router : Router, private cards: CardsService) {}

  async showAllNotes(){
    console.log(await this.cards.getCards());

    const currentNotifications = await LocalNotifications.getPending();
    const idsNotifications = currentNotifications.notifications.map(
      notification => notification.id);
    const notifications = currentNotifications.notifications.map(
      notification =>
        notification.extra.customReminder
    )
    console.log(notifications, idsNotifications);
  }

  hasOpenSettings():boolean{
    return this.router.url.includes('tabs/settings');
  }

  async openSettings(){
    const modal = await this.mc.create({
      component: SettingsPage,
      breakpoints: [0, 0.93, 1],
      initialBreakpoint: 0.93
    })

    await modal.present();
  }
}

