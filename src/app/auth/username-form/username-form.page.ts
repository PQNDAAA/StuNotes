import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Api} from "../../api/services/api";
import {Router} from "@angular/router";
import {Auth} from "../auth";

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.page.html',
  styleUrls: ['./username-form.page.scss'],
  standalone: false
})
export class UsernameFormPage implements OnInit {

  username!: string;

  constructor(private api: Api, private router: Router, private authService: Auth) {
  }

  ngOnInit() {
  }

  checkUsername(event: any) {
    this.username = event.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
    event.target.value =  this.username;
  }

  isValidUsername(username: string) {
    return this.authService.isValidUsername(username);
  }

  valid(usernameForm: NgForm) {
    if (usernameForm.valid) {
      this.api.modifyUsername(this.username).subscribe(async () => {
        await this.router.navigate(['/tabs/notes']);
      }, error => {
        console.log(error.message);
      });
    }
  }
}
