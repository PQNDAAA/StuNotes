import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {BehaviorSubject} from "rxjs";
import {default_settings, ISettingsHome} from "../settings-interface/isettings-home";

@Injectable({
  providedIn: 'root',
})
export class Settings extends Dexie {

  private settingsHomeSubject = new BehaviorSubject<ISettingsHome>(default_settings);
  settingsHome$ = this.settingsHomeSubject.asObservable();

  settingsHomeTable !: Table<ISettingsHome,number>;

  constructor() {
    super('SettingsHomeDB');
    this.version(1).stores({
      settings:'id, darkMode, reminders, urgentDeadlineAlerts, currentLanguage, firstLaunch'
    });
    this.settingsHomeTable = this.table('settings');
  }

  async init() {
    //this.settingsHomeTable.clear();
    await this.addDefaultSettings();
  }

  public getSettings() : ISettingsHome{
    return this.settingsHomeSubject.getValue();
  }


  async addDefaultSettings(){
    let row = await this.settingsHomeTable.get(1);

    if(!row) {
      this.settingsHomeTable.put(default_settings,1);
    }
    await this.refreshValues();
    console.log(row);
  }

  async changeSettingsValue(settings: ISettingsHome){
    const row = await this.settingsHomeTable.get(1);

    if(!row) return;
    this.settingsHomeTable.put(settings, 1);
    await this.refreshValues();
  }

  async refreshValues(){
    const allValues = await this.settingsHomeTable.get(1);
    if(!allValues) return;
    this.settingsHomeSubject.next(allValues);
  }

  async updateReminders(settings: ISettingsHome, value: boolean) {
    settings.reminders = value;
    await this.changeSettingsValue(settings)
  }
}
