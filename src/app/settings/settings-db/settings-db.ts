import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {ISettingsHome} from "../settings-interface/isettings-home";

@Injectable({
  providedIn: 'root',
})
export class SettingsDB extends Dexie {

  settingsHomeTable !: Table<ISettingsHome,number>;

  constructor() {
    super('SettingsHomeDB');
    this.version(1).stores({
      settings:'id, darkMode, reminders, manualReminders, urgentDeadlineAlerts, currentLanguage, firstLaunch'
    });
    this.settingsHomeTable = this.table('settings');
  }

}
