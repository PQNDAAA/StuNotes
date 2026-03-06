import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {BehaviorSubject} from "rxjs";
import {default_settings, ISettingsHome} from "../settings-interface/isettings-home";
import {SettingsDB} from "../settings-db/settings-db";

@Injectable({
  providedIn: 'root',
})
export class Settings {

  private settingsHomeSubject = new BehaviorSubject<ISettingsHome>(default_settings);
  settingsHome$ = this.settingsHomeSubject.asObservable();

  private db = new SettingsDB();

  constructor() {}

  async initSettings() {
    const stored = await this.db.settingsHomeTable.get(1);

    if(!stored) this.db.settingsHomeTable.put(default_settings,1);

    await this.refreshValues();
    console.log(stored);
  }

  async changeSettingsValue(settings: ISettingsHome){
    this.getSettingsTable().put(settings, 1);
    await this.refreshValues();
  }

  async refreshValues(){
    const allValues = await this.getSettingsTable().get(1)
    if(!allValues) return;
    this.settingsHomeSubject.next(allValues);
  }

  async updateReminders(settings: ISettingsHome, value: boolean) {
    settings.reminders = value;
    await this.changeSettingsValue(settings)
  }

  public getSettings() : ISettingsHome{return this.settingsHomeSubject.getValue();}

  getSettingsTable(){return this.db.settingsHomeTable;}
}
