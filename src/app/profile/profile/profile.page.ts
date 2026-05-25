import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {defaultUser, UserInterface} from "../interface/user-interface";
import {Api} from "../../api/services/api";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  userSubject = new BehaviorSubject<UserInterface>(defaultUser);
  user$ = this.userSubject.asObservable();

  constructor(private apiService: Api, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    }

  ionViewWillEnter() {
    this.getUserValues();
  }

  getUserValues() {
    this.apiService.getUserById().subscribe((response : any) => {
      this.refreshUserValues({
        email: response.user.email, username: response.user.username,
        birthDate: new Date(response.user.dateofbirthday).toLocaleString(this.getCurrentLang(), {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      });
    }, (err) => {
      console.error(err.error.message);
    });
  }

  refreshUserValues(value: UserInterface) {
    this.userSubject.next(value);
    console.log("[RefreshUserValues] finished");
  }

  getCurrentLang() {
    return this.translateService.getCurrentLang();
  }

}
