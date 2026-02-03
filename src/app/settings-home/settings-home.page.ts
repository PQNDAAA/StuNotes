import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {Settings} from "../settings";
import {ISettingsHome} from "../isettings-home";
import {async, Observable} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  settings!: ISettingsHome;

  settings$: Observable<ISettingsHome>;

  isCondensate = false;

  constructor(private mc : ModalController, private settingsservice: Settings, private translate: TranslateService) {
    this.settings$ = this.settingsservice.settingsHome$;
    console.log(this.settings$);
  }

  ngOnInit() {
    this.settings$.subscribe(data => {
      this.settings = data
      console.log(this.settings)
    });
  }

  async onLanguageChange(event : any){
    const detail = event.detail.value.trim();
    this.translate.use(detail);
    this.settings.currentLanguage = detail;
    await this.settingsservice.changeSettingsValue(this.settings);
  }

  get getCurrentLanguage(): string{
    return this.translate.getCurrentLang();
  }

  get getAllLanguages(){
    return this.translate.getLangs();
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

  async onToggle(settings: string,event: any){
    const value = event.detail.checked;

    switch (settings) {
      case 'darkMode':
        this.settings.darkMode = value;
        document.body.classList.toggle('dark',this.settings.darkMode);
        break;
      case 'reminders':
        this.settings.reminders = value;
        break;
      case 'urgentDeadlineAlerts':
        this.settings.urgentDeadlineAlerts = value;
        break;
    }
    await this.settingsservice.changeSettingsValue(this.settings);
  }
}
