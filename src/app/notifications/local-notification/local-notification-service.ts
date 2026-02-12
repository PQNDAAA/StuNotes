import {Injectable} from '@angular/core';
import {LocalNotifications} from "@capacitor/local-notifications";
import {Card} from "../../cards/cards-interface/card";
import {CardsService} from "../../cards/cards-service/cards-service";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  public notificationReceived$ = new Subject<number>();
  public notificationActionPerformed$ = new Subject<number>();

  constructor(private translate: TranslateService) {
  }

  async initLocalNotifications() {
    await this.registerLocalNotifications();
  }

  // A FAIRE : Quand on modifie une note statut en cours avec deja des rappels, si l'utilisateur veut modifier
  // la date déjà saisi, il faut recalculer les rappels

  CalculateSchedule(card: Card) {
    const deadLineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadLineMs - now;

    if (card.id === undefined || deadLineMs < now) {
      return [];
    }

    if (diff > 48 * 60 * 60 * 1000) {
      return [{title: '24h', time: deadLineMs - 24 * 60 * 60 * 1000},
        {title: '12h', time: deadLineMs - 12 * 60 * 60 * 1000},
        {title: '2h', time: deadLineMs - 2 * 60 * 60 * 1000},
        {title: '15min', time: deadLineMs - 15 * 60 * 1000}]; // 24h, 12h, 2h et 15min avant
    } else if (diff > 24 * 60 * 60 * 1000) {
      return [{title: '12h', time: deadLineMs - 12 * 60 * 60 * 1000},
        {title: '2h', time: deadLineMs - 2 * 60 * 60 * 1000},
        {title: '15min', time: deadLineMs - 15 * 60 * 1000}]; // 12h, 2h et 15min avant
    } else if (diff > 6 * 60 * 60 * 1000) {
      return [{title: '4h', time: deadLineMs - 4 * 60 * 60 * 1000},
        {title: '30min', time: deadLineMs - 30 * 60 * 1000}]; // 4h et 30min avant
    } else if (diff > 2 * 60 * 60 * 1000) {
      return [{title: '1h', time: deadLineMs - 60 * 60 * 1000},
        {title: '15min', time: deadLineMs - 15 * 60 * 1000}];  //1h et 15min avant
    } else {
      return [{title: 'Half Time', time: deadLineMs - Math.floor(diff / 2)}]; //A la moitié du temps
    }
  }

  async CreateLocalNotification(alerts: any[], card: Card) {
    const taskIds = [];

    if (alerts.length === 0 || card.id === undefined) {
      return [];
    }
    for (let alert of alerts) {
      const taskId = (card.id * 10) + alerts.indexOf(alert) ;
      const title = this.translate.instant('NOTIFICATIONS.Title');
      const body = this.translate.instant('NOTIFICATIONS.Body');
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title + card.name,
            body: body + new Date(card.deadline).toLocaleString(this.translate.getCurrentLang(), {
              year: "numeric",
              month:"long",
              day:"numeric",
              hour: "numeric",
              minute:"2-digit"
            }) + " •" + card.tag,
            id: taskId,
            schedule: {at: new Date(alert.time)}, // Date précise
            sound: 'default',
            extra: {
              cardId: card.id
            }
          }]
      })
      taskIds.push(taskId);
    }
    return taskIds;
  }

  async getAllScheduled() {
    const list = await LocalNotifications.getPending();
    return list.notifications;
  }

  async clearScheduled(ids: number[]) {
    const allScheduled = await this.getAllScheduled();
    console.log(ids);

    for (let value of allScheduled) {
      if (ids.includes(value.id)) {
        await LocalNotifications.cancel({
          notifications: [{id: value.id}]
        });
        console.log("Notification supprimée n°: ", value.id);
      } else {
        console.log("Notification non supprimée.");
      }
    }
    const stillScheduled = await this.getAllScheduled();
    console.log("Voici les notifications actuelles : ", stillScheduled);
  }

  async clearAll() {
    const list = await LocalNotifications.getPending();

    if(list.notifications.length !== 0){
      await LocalNotifications.cancel(await LocalNotifications.getPending());
      console.log("Toutes les notifications ont été supprimées");
    } else {
      console.log("Pas de notifications à supprimer");
    }
  }

  private async registerLocalNotifications() {
    LocalNotifications.checkPermissions().then(async (permission) => {
      if (permission.display !== 'granted') {
        await LocalNotifications.requestPermissions();
      } else {
        console.log(this.getAllScheduled());
      }
    })

    await LocalNotifications.addListener("localNotificationReceived", (notification) => {
      console.log("Notification reçue par l'utilisateur", notification);
      this.notificationReceived$.next(notification.id);
    })

    await LocalNotifications.addListener("localNotificationActionPerformed", (notification) => {
      console.log("L'utilisateur a intéragi avec la notification", notification);

      const id = notification.notification.extra.cardId;
      this.notificationActionPerformed$.next(id);
    })
  }
}
