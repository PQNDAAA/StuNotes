import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {Settings} from "../settings";
import {ISettingsHome} from "../isettings-home";
import {async, Observable} from "rxjs";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  isDarkMode = false;

  settings$: Observable<ISettingsHome>;

  isCondensate = false;

  constructor(private mc : ModalController, private settingsservice: Settings) {
    this.settings$ = this.settingsservice.settingsHome$;
    console.log(this.settings$);
  }

  ngOnInit() {
    this.settings$.subscribe(data => {
      this.isDarkMode = data.darkMode
      console.log(this.isDarkMode)
    })
  }

  onScroll(event: any){
    const scrollTop = event.detail.scrollTop;
    console.log("Scroll position ",scrollTop);

    if(scrollTop > 60){
      console.log("Atteint");
      this.isCondensate = true;
    } else {
      this.isCondensate = false;
      console.log("<60");
    }
  }

  async onToggleDarkMode(event: any){
    this.isDarkMode = event.detail.checked;

    document.body.classList.toggle('dark',this.isDarkMode);
    await this.settingsservice.changeValueDarkMode(this.isDarkMode);
  }
}
