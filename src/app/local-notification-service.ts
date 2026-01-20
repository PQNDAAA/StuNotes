import { Injectable } from '@angular/core';
import {LocalNotifications} from "@capacitor/local-notifications";
import {Card} from "./cards/cards-interface/card";

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  initLocalNotifications(){
    this.registerLocalNotifications();
  }

  CalculateSchedule(card: Card) {
    const deadLineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadLineMs - now;

    if (card.id === undefined || deadLineMs < now) {
      return [];
    }

    if (diff > 24 * 60 * 60 * 1000) {
      return [{title: '12h', time: deadLineMs - 12 * 60 * 60 * 1000},
        {title: '1h', time: deadLineMs- 60 * 60 * 1000},];
    } else if (diff > 12 * 60 * 60 * 1000) {
      return [{title: '4h', time: deadLineMs - 4 * 60 * 60 * 1000}];
    } else if (diff > 2 * 60 * 60 * 1000) {
      return [{title: '1h', time: deadLineMs - 60 * 60 * 1000}];
    } else {
      return [{title: 'Half Time', time: deadLineMs - Math.floor(diff / 2)}];
    }
  }

  async CreateLocalNotification(alerts: any[], card: Card){
    const taskIds = [];

    if(alerts.length == 0) {
      return [];
    }

    for(let alert of alerts) {
      const taskId = card.id + alert.time;
      await LocalNotifications.schedule({
        notifications: [
          {
            title: "Rappel de tâche : " + card.name,
            body: card.description,
            id: taskId,
            schedule: {at: new Date(alert.time)}, // Date précise
            sound: 'default',
            extra: {
              taskId: taskId
            }}]
      })
      taskIds.push(taskId);
    }
    return taskIds;
  }

  async getAllScheduled(){
    const list = await LocalNotifications.getPending();
    return list.notifications;
  }

  async clearScheduled(ids : number[]){
    const allScheduled = await this.getAllScheduled();
    console.log(ids);

    for(let value of allScheduled){
      if(ids.includes(value.id)){
        await LocalNotifications.cancel({
          notifications: [{ id : value.id}]
        });
        console.log("Notification supprimée n°: ", value.id);
      } else {
        console.log("Notification non supprimée.");
      }
    }
    const stillScheduled = await this.getAllScheduled();
    console.log("Voici les notifications actuelles : ",stillScheduled);
  }

  async clearAll(){
    await LocalNotifications.cancel(await LocalNotifications.getPending());
    console.log("Toutes les notifications ont été supprimées")
  }

  private registerLocalNotifications(){
    LocalNotifications.checkPermissions().then(async (permission) => {
      if(permission.display !== 'granted'){
        await LocalNotifications.requestPermissions();
      } else {
        console.log(this.getAllScheduled());
      }
    })
  }
}
