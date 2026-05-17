import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Api} from "../../api/services/api";
import {Router} from "@angular/router";
import {Auth} from "../auth";
import {App} from "../../app";

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.page.html',
  styleUrls: ['./username-form.page.scss'],
  standalone: false
})
export class UsernameFormPage implements OnInit {

  username: string = "";
  usernameExists: boolean = false;

  constructor(private api: Api, private appService: App, private router: Router,
              private authService: Auth) {}

  ngOnInit() {
  }

  checkUsername(event: any) {
    this.username = event.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
    event.target.value =  this.username;
  }

  async checkUsernameExists(username: string) {
    this.usernameExists = await this.authService.checkUsernameExists(username);
  }

  isValidUsername(username: string) {
    return this.authService.isValidUsername(username);
  }

  submitUsername(usernameForm: NgForm) {
    if (usernameForm.valid) {
      this.api.modifyUsername(this.username).subscribe(async () => {
        await this.appService.initAllElements();
        this.appService.setReady();
        await this.router.navigate(['/tabs']);
      }, error => {
        console.log(error.message);
      });
    }
  }

  isValidForm(){
    return this.isValidUsername(this.username) && !this.usernameExists;
  }
}
