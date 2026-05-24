import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {defaultUser, UserInterface} from "../interface/user-interface";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  userSubject = new BehaviorSubject<UserInterface>(defaultUser);
  user$ = this.userSubject.asObservable();

  constructor() {
  }

  ngOnInit() {
    this.userSubject.subscribe(value => {
      console.log(value);
    });
  }

}
