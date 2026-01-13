import { Injectable } from '@angular/core';
import {LocalNotifications} from "@capacitor/local-notifications";

@Injectable({
  providedIn: 'root'
})
export class LocalNotificationService {

  initLocalNotifications(){
    this.registerLocalN();
  }



  private registerLocalN(){
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
