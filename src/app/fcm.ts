import { Injectable } from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class Fcm {

  constructor( private router : Router) {
  }

  initPush(){
    console.log("Platform is working..");
    if(Capacitor.isNativePlatform()){
      this.registerPush();
    }
  }

  private registerPush(){
    PushNotifications.requestPermissions().then(async(permission) => {
      if(permission.receive == "granted"){
        await PushNotifications.register();
      } else {
        // No perm
      }
    });
    PushNotifications.addListener('registration', async token => {
      console.log("token", token);

      if (token)
        localStorage.setItem('push-notification-token', token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error', JSON.stringify(error));
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async (notification) => {
      console.log("notification", notification);

      const data = notification.notification;
      console.log("data token data", data.data);

      //await this.router.navigateByUrl("/redirect-notification");
    });

}

}
