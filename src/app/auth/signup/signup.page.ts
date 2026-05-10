import {Component, OnInit} from '@angular/core';
import {SignupInterface} from "./interface/signup-interface";
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Auth} from "../auth";

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

  constructor(private api: Api, private authService: Auth) {
  }

  ngOnInit() {
  }

  // FINIR LA VALIDATION DE L INSCRIPTION et au niveau backend regarder si l'email & le username sont déjà utilisé au moment de l'inscription
  valid(form: NgForm) {
    if (form.valid) {
      this.api.createUser(this.newUser).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error.error.message);
      });
    }
  }

  checkUsername(event: any) {
    this.newUser.username = event.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
    event.target.value = this.newUser.username;
  }

  checkEmailExists(email: string) {
    if (!this.isValidEmail(email)) {
      if (this.emailExists) this.emailExists = false;
      return;
    }

    this.api.checkEmailExists(email).subscribe(response => {
      const str = JSON.stringify(response);
      this.emailExists = JSON.parse(str);
    });
  }

  checkUsernameExists(username: string) {
    if (!this.isValidUsername(username)) {
      if (this.usernameExists) this.usernameExists = false;
      return;
    }

    this.api.checkUsernameExists(username).subscribe(response => {
      const str = JSON.stringify(response);
      this.usernameExists = JSON.parse(str);
    });
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
}
