import {Component, OnInit} from '@angular/core';
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginInterface} from "./interface/login-interface";
import {AppComponent} from "../../app.component";
import {LoadingController, Platform} from "@ionic/angular";
import {Auth} from "../auth";
import {App} from "../../app";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  currentUser: LoginInterface = {
    email: '',
    password: '',
  }

  isIos = false;

  loginInProgress = false;

  constructor(private api: Api, private platform: Platform, private authService: Auth, private loadingCtrl: LoadingController) {
    this.isIos = this.platform.is('ios');
  }

  ngOnInit() {
  }

  async onLogin(form: NgForm) {
    if (form.valid) {
      const loading = await this.loadingCtrl.create({
        spinner: 'crescent',
      });
      await loading.present();
      this.loginInProgress = true;

      this.api.login(this.currentUser).subscribe(async response => {
        const str = JSON.stringify(response);
        const result = JSON.parse(str);
        localStorage.setItem('token', result.accessToken);

        await this.authService.checkToken();

        await loading.dismiss();
        this.loginInProgress = false;
      }, async error => {
        await loading.dismiss();
        this.loginInProgress = false;
        console.error(error.error.message ?? 'Login failed');
      });
    }
  }

  async loginWithApple() {
    await this.authService.loginWithApple();
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
  }

  getUser() {
    this.api.getUserById().subscribe(response => {
      const str = JSON.stringify(response);
      const result = JSON.parse(str);
      console.log(result.name);
    }, error => {
      console.error(error.error.message);
    })
  }

   isValidEmail(email: string) {
    return this.authService.isValidEmail(email);
  }
}
