import {Component, OnInit} from '@angular/core';
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {LoginInterface} from "./interface/login-interface";
import {AppComponent} from "../../app.component";
import {Platform} from "@ionic/angular";
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

  constructor(private api: Api, private router: Router, private platform: Platform, private auth: Auth,
              private appService : App) {
    this.isIos = this.platform.is('ios');
  }

  ngOnInit() {
  }

  valid(form: NgForm) {
    if (form.valid) {
      this.api.login(this.currentUser).subscribe(async response => {
        const str = JSON.stringify(response);
        const result = JSON.parse(str);
        localStorage.setItem('token', result.accessToken);
        await this.appService.checkToken();
      }, error => {
        console.error(error.error.message);
      });
    }
  }

  async loginWithApple() {
    await this.auth.loginWithApple();
  }

  async loginWithGoogle() {
    await this.auth.loginWithGoogle();
  }

  get isLogging() {
    return this.auth.loginInProgress;
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
    return this.auth.isValidEmail(email);
  }
}
