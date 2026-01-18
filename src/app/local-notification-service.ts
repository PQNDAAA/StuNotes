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

    let alerts = [
      {title : '', time: 0}
    ];

    // TRAVAILLER SUR L'ID DE LA TACHE / FAIRE EN SORTE DE SUPPRIMER LE RAPPEL QUAND LA TACHE EST DELETE
    // clean le code de service.

    if(task.id !== undefined) {
      if (deadLineMs > now) {
        if(diff > 24 * 60 * 60 * 1000){
          // 12h avant reminderDate = deadLineMs - (12 * 60 * 60 * 1000);
          alerts = [{title: '12h', time: 12 * 60 * 60 * 1000},
            {title: '1h', time: 60 * 60 * 1000},];
          console.log("12h avant");

        } else if(diff > 12 * 60 * 60 * 1000){
         //reminderDate = deadLineMs - (4 * 60 * 60 * 1000); // 4h avant
          alerts = [{title: '4h', time: 4 * 60 * 60 * 1000}];
          console.log("4h avant");

        } else if(diff > 2 * 60 * 60 * 1000){
          //reminderDate = deadLineMs - (60 * 60 * 1000); // 1h avant
          alerts = [{title: '1h', time: 60 * 60 * 1000}];
          console.log("1h avant");

        } else {
          //reminderDate = Math.floor(deadLineMs - (diff / 2)); // Moitie du temps
          alerts = [{title: 'Half Time', time: Math.floor(diff/2)}];
          console.log("juste avant");
        }

        for(let alert of alerts) {
          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Rappel de tâche : " + task.name,
                body: task.description,
                id: task.id+alert.time,
                schedule: {at: new Date(deadLineMs - alert.time)}, // Date précise
                sound: 'default',
                extra: {
                  taskId: task.id+alert.time // Donnée utile
                }
              }
            ]
          })
        }
      } else {
        console.log("Impossible de créer un rappel inférieur.");
      }
    } else {
      console.log("ID Error");
    }
    console.log("Deadline : ", deadLineMs);
    console.log(alerts);
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
        console.log(this.getAllScheduled());
      }
    })
  }
}
