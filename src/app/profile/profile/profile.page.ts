import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {defaultUser, UserInterface} from "../interface/user-interface";
import {Api} from "../../api/services/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  userSubject = new BehaviorSubject<UserInterface>(defaultUser);
  user$ = this.userSubject.asObservable();

  constructor(private apiService: Api) {
  }

  ngOnInit() {
    this.apiService.getUserById().subscribe(response => {
      const str = JSON.stringify(response);
      const value = JSON.parse(str);
      this.refreshUserValues({email: value.user.email, username: value.user.username,
        birthDate: value.user.dateofbirthday});
    }, (err) => {
      console.error(err.error.message);
    });
  }

  refreshUserValues(value: UserInterface) {
    this.userSubject.next(value);
    console.log("[RefreshUserValues] finished");
  }

}
