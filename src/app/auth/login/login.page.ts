import {Component, OnInit} from '@angular/core';
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginInterface} from "./interface/login-interface";
import {AppComponent} from "../../app.component";
import {LoadingController, Platform} from "@ionic/angular";
import {Auth} from "../auth";
import {App} from "../../app";
import {firstValueFrom} from "rxjs";

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

  constructor(private api: Api, private platform: Platform, private authService: Auth, private loadingCtrl: LoadingController,
              private app: App, private router: Router) {
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

      try {
        const response = await firstValueFrom(this.api.login(this.currentUser));
        // On stocke le token
        const str = JSON.stringify(response);
        const result = JSON.parse(str);
        localStorage.setItem('token', result.accessToken);

        //On init les elements de l'app
        await this.app.initAllElements();
        this.app.setReady();
        await this.router.navigate(['/tabs']);
      } catch (error: any) {
        console.error(error.error.message ?? "Login failed.");
      } finally {
        await loading.dismiss();
        this.loginInProgress = false;
      }
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
