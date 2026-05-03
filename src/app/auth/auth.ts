import { Injectable } from '@angular/core';
import {SocialLogin} from "@capgo/capacitor-social-login";
import {Api} from "../api/services/api";

@Injectable({
  providedIn: 'root',
})
export class Auth {

  constructor(private api: Api) {
  }

  async loginWithGoogle(){

    try {
      const result = await SocialLogin.login({
        provider: 'google',
        options: {scopes: ['profile', 'email']
        }
      });

      if(result.provider === 'google'){
        const req = result.result as any;

        console.log("Utilisateur Android: ", req.profile.name,req.profile.email);
      }
    } catch(err) {
      console.log(err);
    }
  }

  async loginWithApple() {
    try {
      const result = await SocialLogin.login({
        provider: 'apple',
        options: {scopes: ['email', 'name']}
      });

      if (result.provider === 'apple') {
        const req = result.result;

        console.log("Utilisateur Apple: ", req.profile.user, req.profile.email);
      }
    } catch (err) {
      console.log(err);
    }
  }
}
