import { Component, OnInit } from '@angular/core';
import {Api} from "../../api/services/api";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  user = {
    email: '',
    password: '',
  }

  constructor(private api: Api, private router:Router) { }

  ngOnInit() {
  }

  valid(form: NgForm){
    if(form.valid){
      this.api.login(this.user).subscribe(response=> {
        const str = JSON.stringify(response);
        const result = JSON.parse(str);
        localStorage.setItem('token', result.accessToken);
        console.log(result.accessToken);

        this.router.navigate(['/tabs/notes']);
      }, error => {
        console.error(error.error.message);
      });
    }
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
