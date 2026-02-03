import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { Device } from '@capacitor/device';
import {Settings} from "./settings";
import {ISettingsHome} from "./isettings-home";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  settings!: ISettingsHome;

  constructor(private translate: TranslateService, private settingsService: Settings) {
    this.settingsService.settingsHome$.subscribe((data => {
      this.settings = data;
    }));
  }

  async initLanguages(){

    const supportedLanguages = this.translate.getLangs();
    const deviceInfo = await Device.getLanguageCode();
    let deviceLanguage = deviceInfo.value;

    if(supportedLanguages.includes(deviceLanguage)){
      if(this.settings.currentLanguage) {
        if (deviceLanguage === this.settings.currentLanguage) {
          this.translate.use(deviceLanguage);
        } else {
          this.translate.use(this.settings.currentLanguage);
        }
      } else {
        this.translate.use(deviceLanguage);
      }
    } else {
      this.translate.use('en');
    }
    console.log("Language Service Initialized");
  }

}
