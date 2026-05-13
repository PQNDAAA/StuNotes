import {Component, OnInit} from '@angular/core';
import {SignupInterface} from "./interface/signup-interface";
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Auth} from "../auth";
import {LoadingController, ModalController} from "@ionic/angular";
import {SignupApprovedPage} from "../signup-approved/signup-approved.page";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {

  newUser: SignupInterface = {
    dateOfBirthday: "",
    email: "",
    password: "",
    username: ""
  }

  emailExists: boolean = false;
  usernameExists: boolean = false;

  signupInProgress: boolean = false;

  constructor(private api: Api, private authService: Auth, private modalCtrl: ModalController,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
  }

  async onSignup(form: NgForm) {
    if (form.valid) {
      const loading = await this.loadingCtrl.create({
        spinner: 'crescent',
      });

      await loading.present();
      this.signupInProgress = true;

      this.api.createUser(this.newUser).subscribe(async response => {
        await loading.dismiss();
        this.signupInProgress = false;

        const modal = await this.modalCtrl.create({
          component: SignupApprovedPage,
          breakpoints: [0.28, 0.3, 0.32],
          initialBreakpoint: 0.3
        });
        await modal.present();
        this.clearNewUser();
        console.log(response);

      }, async error => {
        await loading.dismiss();
        this.signupInProgress = false;
        console.log(error.error.message);
      });
    }
  }

  checkUsername(event: any) {
    this.newUser.username = event.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
    event.target.value = this.newUser.username;
  }

  async checkEmailExists(email: string) {
    this.emailExists = await this.authService.checkEmailExists(email);
  }

  async checkUsernameExists(username: string) {
    this.usernameExists = await this.authService.checkUsernameExists(username);
  }

  isValidUsername(username: string): boolean {
    return this.authService.isValidUsername(username);
  }

  isValidPassword(password: string): boolean {
    const hasGoodLength = password.length >= 8 && password.length <= 128;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChars = /[!@#$%^&*_\-+=]/.test(password);

    return hasGoodLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChars;
  }

  isValidEmail(email: string): boolean {
    return this.authService.isValidEmail(email);
  }

  isValidForm(): boolean {
    return this.isValidPassword(this.newUser.password) && this.isValidUsername(this.newUser.username) &&
      this.isValidEmail(this.newUser.email) && !this.emailExists && !this.usernameExists;
  }

  private clearNewUser() {
    this.newUser = {
      dateOfBirthday: "",
      email: "",
      password: "",
      username: ""
    };
  }
}
