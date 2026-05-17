import {Injectable} from '@angular/core';
import {SocialLogin} from "@capgo/capacitor-social-login";
import {Api} from "../api/services/api";
import {Router} from "@angular/router";
import {LoadingController} from "@ionic/angular";
import {firstValueFrom} from "rxjs";
import {App} from "../app";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class Auth {

  loginWithInProgress = false;

  constructor(private api: Api, private router: Router, private loadingCtrl: LoadingController,
              private appService: App) {
  }

  async loginWithGoogle() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });
    await loading.present();
    this.loginWithInProgress = true;

    try {
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

        const response = await firstValueFrom(this.api.googleSignup(idToken));
        // On stocke le token
        const str = JSON.stringify(response);
        const parse = JSON.parse(str);
        localStorage.setItem('token', parse.accessToken);

        console.log("Nouveau utilisateur : ", parse.isNewUser);

        if (parse.isNewUser) {
          await this.router.navigate(['/username-form']);
        } else {
          await this.appService.initAllElements();
          this.appService.setReady();
          await this.router.navigate(['/tabs']);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      await loading.dismiss();
      this.loginWithInProgress = false;
    }
  }

  async loginWithApple() {
    const loading = await this.loadingCtrl.create({
      spinner: 'crescent',
    });
    await loading.present();
    this.loginWithInProgress = true;

    try {
      const result = await SocialLogin.login({
        provider: 'apple',
        options: {scopes: ['email', 'name']}
      });

      if (result.provider === 'apple') {
        const req = result.result;
        const idToken = req.idToken;
        const email = req.profile.email
        const user = req.profile.user;

        if (!idToken || !email || !user) return;

        console.log("Utilisateur Apple: ", req);

        const response = await firstValueFrom(this.api.appleSignup(idToken, email, user));
        // On stocke le token
        const str = JSON.stringify(response);
        const parse = JSON.parse(str);
        localStorage.setItem('token', parse.accessToken);

        if (parse.isNewUser) {
          await this.router.navigate(['/username-form']);
        } else {
          //On init les elements de l'app
          await this.appService.initAllElements();
          this.appService.setReady();
          await this.router.navigate(['/tabs']);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      await loading.dismiss();
      this.loginWithInProgress = false;
    }
  }

  async checkToken(): Promise<boolean> {
    const token = localStorage.getItem("token");

    try {
      if (!token) {
        await this.router.navigate(['/landing']);
        console.error("Token not found");
        return false;
      }

      const response = await firstValueFrom(this.api.getUserById());
      const str = JSON.stringify(response);
      const value = JSON.parse(str);

      if (!value) {
        await this.removeToken();
        return false;
      }
      return true;
    } catch (err) {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          await this.removeToken();
          return false;
        }
      }
      return false;
    } finally {
      console.log("Check token finished.");
    }
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      if (!this.isValidUsername(username)) return false;
      const result = await firstValueFrom(this.api.checkUsernameExists(username));
      const str = JSON.stringify(result);
      return JSON.parse(str);
    } catch (e) {
      console.error("[checkUsernameExists] Error: ", e);
      return false;
    }
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      if (!this.isValidEmail(email)) return false;
      const result = await firstValueFrom(this.api.checkEmailExists(email));
      const str = JSON.stringify(result);
      return JSON.parse(str);
    } catch (e) {
      console.error("[checkEmailExists] Error: ", e);
      return false;
    }
  }

  async removeToken() {
    localStorage.removeItem("token");
    console.log("Token removed");
    await this.router.navigate(['/login']);
  }

  async onAppResume() {
    const hasToken = await this.checkToken();
    if (hasToken) {
      await this.appService.initApp();
    }
  }

  isValidUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 20;
  }

  isValidEmail(email: string) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/.test(email);
  }

}
