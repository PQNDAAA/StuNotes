import {Injectable} from '@angular/core';
import {LocalNotifications} from "@capacitor/local-notifications";
import {Card} from "../../cards/cards-interface/card";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsHome} from "../../settings/settings-interface/isettings-home";
import {Settings} from "../../settings/settings-service/settings";

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  public notificationReceived$ = new Subject<number>();
  public notificationActionPerformed$ = new Subject<number>();

  settings!: ISettingsHome;

  constructor(private translate: TranslateService, private settingsService: Settings) {
    this.settingsService.settingsHome$.subscribe(data => {
      this.settings = data;
    })
  }

  async initLocalNotifications() {
    await this.registerLocalNotifications();
  }

  async rebuildReminderForCard(card: Card) : Promise<Card> {
    card.taskId = await this.CreateLocalNotification(this.CalculateSchedule(card),card);
    return card;
  }

  CalculateSchedule(card: Card) {
    const deadLineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadLineMs - now;

    if (card.id === undefined || deadLineMs < now || !this.settings.reminders) {
      return [];
    }

    this.generateDynamicOffSets(card,0.85, 0,2,1,360);

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

  generateDynamicOffSets(card: Card,f : number = 1, a : number = 0, n : number = 4, minWindowHours: number = 1, maxWindowHours: number = 360) {
    const fractions = [0.25,0.5,0.9,0.99].slice(a,n);
    const deadlineFractions = 1;
// Pour une petit deadline on prend un grand F et pour une grande deadline on prend un petit F
    fractions.push(deadlineFractions);

    const deadLineMs = new Date(card.deadline).getTime();
    const diffMs = deadLineMs - Date.now();

    const minWindowMs = minWindowHours*60*60*1000;
    const maxWindowMs = maxWindowHours*60*60*1000;

    const windowMs = Math.min(Math.max(f * diffMs, minWindowMs),maxWindowMs);

    const reminders = fractions.map(f => new Date(deadLineMs - windowMs + windowMs * f));

    console.log(reminders);

  }

  async CreateLocalNotification(alerts: any[], card: Card) {
    const taskIds = [];

    if (alerts.length === 0 || card.id === undefined) {
      return [];
    }
    for (let alert of alerts) {
      const taskId = (card.id * 10) + alerts.indexOf(alert);
        const title = this.translate.instant('NOTIFICATIONS.Title');
        const body = this.translate.instant('NOTIFICATIONS.Body');
        await LocalNotifications.schedule({
          notifications: [
            {
              title: title + card.name,
              body: body + new Date(card.deadline).toLocaleString(this.translate.getCurrentLang(), {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
              }) + " •" + card.tag,
              id: taskId,
              schedule: {at: new Date(alert.time)}, // Date précise
              sound: 'default',
              extra: {
                cardId: card.id
              }
            }]
        });
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

    if (list.notifications.length !== 0) {
      await LocalNotifications.cancel(await LocalNotifications.getPending());
      console.log("Toutes les notifications ont été supprimées");
    } else {
      console.log("Pas de notifications à supprimer");
    }
  }

  private async registerLocalNotifications() {
    LocalNotifications.checkPermissions().then(async (permission) => {
      if (permission.display !== 'granted') {
        const request = await LocalNotifications.requestPermissions();

        if (request.display !== 'granted') {
          await this.settingsService.updateReminders(this.settings, false);
        } else {
          if (!this.settings.reminders) {
            await this.settingsService.updateReminders(this.settings, true);
          }
        }
      } else {
        if(!this.settings.reminders) {
          await this.clearAll();
        }
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
