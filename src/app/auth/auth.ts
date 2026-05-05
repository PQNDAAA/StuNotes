import { Injectable } from '@angular/core';
import {SocialLogin} from "@capgo/capacitor-social-login";
import {Api} from "../api/services/api";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root',
})
export class Auth {

  loginInProgress = false;

  constructor(private api: Api, private router: Router, private loadingCtrl: LoadingController,) {
  }

  async loginWithGoogle(){
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    try {
      await loading.present();
      this.loginInProgress = true;

      const result = await SocialLogin.login({
        provider: 'google',
        options: {scopes: ['profile', 'email']
        }
      });

      if(result.provider === 'google'){
        const req = result.result as any;
        const idToken : string = req.idToken;

        console.log("Utilisateur Android: ", req.profile.name,req.profile.email);

        this.api.googleSignup(idToken).subscribe(async response=>{
          const str = JSON.stringify(response);
          const result = JSON.parse(str);
          console.log(result.accessToken);
          await loading.dismiss();
          await this.router.navigate(['/tabs/notes']);
        });
      }
    } catch(err) {
      await loading.dismiss();
      console.log(err);
    } finally {
      this.loginInProgress = false;
    }
  }

  async loginWithApple() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    try {
      await loading.present();
      this.loginInProgress = true;

      const result = await SocialLogin.login({
        provider: 'apple',
        options: {scopes: ['email', 'name']}
      });

      if (result.provider === 'apple') {
        const req = result.result;
        console.log("Utilisateur Apple: ", req);

        await loading.dismiss();
        await this.router.navigate(['/tabs/notes']);
      }
    } catch (err) {
      await loading.dismiss();
      console.log(err);
    } finally {
      this.loginInProgress = false;
    }
  }
}
