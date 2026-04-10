import {Injectable} from '@angular/core';
import {LocalNotifications} from "@capacitor/local-notifications";
import {Card} from "../../cards/cards-interface/card";
import {Subject} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import {ISettingsHome} from "../../settings/settings-interface/isettings-home";
import {Settings} from "../../settings/settings-service/settings";
import {RecurringReminders} from "../recurring/service/recurring-reminders";

type notificationReceived = {
  id: number;
  customReminder: number;
};

@Injectable({
  providedIn: 'root'
})

export class LocalNotificationService {


  public notificationReceived$ = new Subject<notificationReceived>();
  public notificationActionPerformed$ = new Subject<number>();
  public notificationGranted$ = new Subject<ISettingsHome>();


  settings!: ISettingsHome;

  constructor(private translate: TranslateService, private settingsService: Settings,
              private recurringRemindersService: RecurringReminders) {
    this.settingsService.settingsHome$.subscribe(data => {
      this.settings = data;
      console.log(data);
    })
  }

  async initLocalNotifications() {
    await this.registerLocalNotifications();
  }

  calculateRecurringReminders(card: Card): Date[] {
    const deadLineMs = new Date(card.deadline).getTime();
    const now = Date.now();

    if (card.id === undefined || deadLineMs < now) {
      console.log(card.id);
      return [];
    }
    return this.recurringRemindersService.calculateRecurringReminders(card);
  }

  calculateSchedule(card: Card): Date[] {
    const deadLineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadLineMs - now;

    if (card.id === undefined || deadLineMs < now) {
      return [];
    }

    const f = this.computeDynamicF(diff);
    const numberReminders = this.computeDynamicNumberReminders(diff);

    return this.generateDynamicOffSets(card, f, numberReminders[0], numberReminders[1]);
  }

// Pour une petit deadline on prend un grand F et pour une grande deadline on prend un petit F
  private generateDynamicOffSets(card: Card, f: number = 1, a: number = 0, n: number = 4, minWindowHours: number = 0.5, maxWindowHours: number = 360): Date[] {
    const fractions = [0.1, 0.3, 0.5, 0.7, 0.9].slice(a, n);
    const deadlineFractions = 1;
    fractions.push(deadlineFractions);

    const deadLineMs = new Date(card.deadline).getTime();
    const diffMs = deadLineMs - Date.now();

    const minWindowMs = minWindowHours * 60 * 60 * 1000;
    const maxWindowMs = maxWindowHours * 60 * 60 * 1000;
    const windowMs = Math.min(Math.max(f * diffMs, minWindowMs), maxWindowMs);

    const reminders = fractions.map(f => new Date(deadLineMs - windowMs + windowMs * f));

    console.log(fractions);
    console.log(reminders);
    return reminders;

  }

  async createLocalNotifications(alerts: Date[], card: Card) {
    const taskIds = [];

    if (alerts.length === 0 || card.id === undefined || !this.settings.taskReminders) {
      console.log("Reminders canceled.", card);
      return [];
    }
    for (let alert of alerts) {
      const timestamp = Date.now() % 1_000_000_000;
      const alertIndex = alerts.indexOf(alert);
      const taskId = (card.id * 10000) + alertIndex + timestamp;

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
            schedule: {at: alert}, // Date précise
            sound: 'default',
            extra: {
              cardId: card.id,
              customReminder: alert.getTime()
            }
          }]
      });
      taskIds.push(taskId);
      console.log("taskId: " + taskId + " Rappel date: " + alert, card);
    }
    return taskIds;
  }

  async clearScheduledTasks(ids: number[]) {
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

  private async registerLocalNotifications() {
    const permission = await LocalNotifications.checkPermissions();

    if (permission.display !== "granted") {

      const request = await LocalNotifications.requestPermissions();

      if (request.display !== "granted") {
        console.log("notif disabled");
        return;
      }
     // if (!this.settings.taskReminders) {
       // const remindersUpdated = {...this.settings, taskReminders: true};
        //await this.settingsService.changeSettingsValue(remindersUpdated);
        //this.notificationGranted$.next(remindersUpdated);
      //}
      //return;
    }

    if (!this.settings.taskReminders) {
      await this.clearAllScheduledTasks();
    }

    console.log("Notifications en cours: ",await this.getAllScheduled());

     await LocalNotifications.addListener("localNotificationReceived", (notification) => {
       console.log("Notification reçue par l'utilisateur", notification);
       this.notificationReceived$.next({id: notification.id, customReminder: notification.extra.customReminder});
     })

    await LocalNotifications.addListener("localNotificationActionPerformed", (notification) => {
      console.log("L'utilisateur a intéragi avec la notification", notification);

      const id = notification.notification.extra.cardId;
      this.notificationActionPerformed$.next(id);
    })
  }

  async clearAllScheduledTasks() {
    const list = await LocalNotifications.getPending();

    if (list.notifications.length !== 0) {
      await LocalNotifications.cancel(await LocalNotifications.getPending());
      console.log("Toutes les notifications ont été supprimées");
    } else {
      console.log("Pas de notifications à supprimer");
    }
  }

  private computeDynamicNumberReminders(diffMs: number) {
    if (diffMs > 360 * 60 * 60 * 1000) return [0, 5];
    if (diffMs > 72 * 60 * 60 * 1000) return [0, 5];
    if (diffMs > 24 * 60 * 60 * 1000) return [0, 4];
    if (diffMs > 6 * 60 * 60 * 1000) return [2, 4];
    if(diffMs > 50 * 60 * 1000) return [2, 3];
    return [0,0];
  }

  private computeDynamicF(diffMs: number) {
    if (diffMs > 360 * 60 * 60 * 1000) return 0.5;
    if (diffMs > 72 * 60 * 60 * 1000) return 0.67;
    if (diffMs > 24 * 60 * 60 * 1000) return 0.78;
    if (diffMs > 6 * 60 * 60 * 1000) return 0.8;
    if (diffMs > 2 * 60 * 60 * 1000) return 0.85;
    return 0.95;
  }

  private async getAllScheduled() {
    const list = await LocalNotifications.getPending();
    return list.notifications;
  }
}
