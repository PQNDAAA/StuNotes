import { Component, OnInit } from '@angular/core';
import {SignupInterface} from "./interface/signup-interface";
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";

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

  constructor(private api: Api) { }

  ngOnInit() {
  }

  valid(form: NgForm) {
    if(form.valid) {
      this.api.createUser(this.newUser).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error.error.message);
      })
    }
  }
}
