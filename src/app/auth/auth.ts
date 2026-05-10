import {Injectable} from '@angular/core';
import {SocialLogin} from "@capgo/capacitor-social-login";
import {Api} from "../api/services/api";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";
import {App} from "../app";

@Injectable({
  providedIn: 'root',
})
export class Auth {

  loginInProgress = false;

  constructor(private api: Api, private router: Router, private loadingCtrl: LoadingController,
              private appService : App) {
  }

  async loginWithGoogle() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });

    try {
      await loading.present();
      this.loginInProgress = true;

      const result = await SocialLogin.login({
        provider: 'google',
        options: {
          scopes: ['profile', 'email']
        }
      });

      if (result.provider === 'google') {
        const req = result.result as any;
        const idToken: string = req.idToken;

        console.log("Utilisateur Android: ", req.profile.name, req.profile.email);

        this.api.googleSignup(idToken).subscribe(async response => {
          const str = JSON.stringify(response);
          const result = JSON.parse(str);
          localStorage.setItem('token', result.accessToken);
          console.log("Nouveau utilisateur : ", result.isNewUser);

          if (result.isNewUser) {
            await this.router.navigate(['/username-form']);
          } else {
            await this.appService.checkToken();
          }
          await loading.dismiss();
        });
      }
    } catch (err) {
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
        const idToken = req.idToken;
        const email = req.profile.email
        const user = req.profile.user;

        if (!idToken || !email || !user) {
          await loading.dismiss();
          return;
        }

        console.log("Utilisateur Apple: ", req);

        this.api.appleSignup(idToken, email, user).subscribe(async response => {
          const str = JSON.stringify(response);
          const result = JSON.parse(str);
          localStorage.setItem('token', result.accessToken);

          if (result.isNewUser) {
            await this.router.navigate(['/username-form']);
          } else {
            await this.appService.checkToken();
          }
          await loading.dismiss();
        });
      }
    } catch (err) {
      await loading.dismiss();
      console.log(err);
    } finally {
      this.loginInProgress = false;
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    if (!this.isValidUsername(username)) return false;

    let value: boolean;

    const result = await firstValueFrom(this.api.checkUsernameExists(username));

    const str = JSON.stringify(result);
    value = JSON.parse(str);
    return value;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    if(!this.isValidEmail(email)) return false;

    let value: boolean;
    const result = await firstValueFrom(this.api.checkEmailExists(email));
    const str = JSON.stringify(result);
    value = JSON.parse(str);
    return value;
  }

  isValidUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 20;
  }

  isValidEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/.test(email);
  }
}
