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

  async ScheduleToDo(task : Card){
    const deadLineMs = new Date(task.deadline).getTime();
    const now = Date.now();
    const diff = deadLineMs - now;

    let reminderDate = 0;

    const alerts = [
      {title : '12h', time: 12*60}
    ];

    if(task.id !== undefined) {
      if (deadLineMs > now) {
        if(diff > 24 * 60 * 60 * 1000){
          reminderDate = deadLineMs - (12 * 60 * 60 * 1000); // 12h avant
          console.log("12h avant");
        } else if(diff > 12 * 60 * 60 * 1000){
          reminderDate = deadLineMs - (4 * 60 * 60 * 1000); // 4h avant
          console.log("4h avant");
        } else if(diff > 2 * 60 * 60 * 1000){
          reminderDate = deadLineMs - (60 * 60 * 1000); // 1h avant
          console.log("1h avant");
        } else {
          reminderDate = Math.floor(deadLineMs - (diff / 2)); // Moitie du temps
          console.log("juste avant");
        }

        await LocalNotifications.schedule({
          notifications: [
            {
              title: "Rappel de tâche : " + task.name,
              body: task.description,
              id: task.id,
              schedule: {at: new Date(reminderDate - 120000)}, // Date précise
              sound: 'default',
              extra: {
                taskId: task.id // Donnée utile
              }
            }
          ]
        })
      } else {
        console.log("Impossible de créer un rappel inférieur.");
      }
    } else {
      console.log("ID Error");
    }
    console.log("Deadline : ", deadLineMs);
    console.log(reminderDate);
  }

  async getAllScheduled(){
    const list = await LocalNotifications.getPending();
    return list.notifications;
  }

  async clearAll(){
    await LocalNotifications.cancel(await LocalNotifications.getPending());
  }



  private registerLocalNotifications(){
    LocalNotifications.checkPermissions().then(async (permission) => {
      if(permission.display !== 'granted'){
        await LocalNotifications.requestPermissions();
      } else {
        await LocalNotifications.schedule({
          notifications: [
            { id: 10, title: "Salut", body: "Notification Ionic", schedule: { at: new Date(Date.now()+3000) } }
          ]
        });
      }
    })
  }
}
