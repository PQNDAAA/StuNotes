import { Component, OnInit } from '@angular/core';
import {Api} from "../../api/services/api";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  constructor(private api: Api) { }

  ngOnInit() {
  }

  getUser(){
    this.api.getUserById().subscribe(response => {
      const str = JSON.stringify(response);
      const result = JSON.parse(str);
      console.log(result.name);
    }, error => {
      console.error(error.error.message);
    })
  }

}
