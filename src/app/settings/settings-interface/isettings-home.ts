export interface ISettingsHome {
  id: number,
  darkMode: boolean,
  reminders: boolean,
  manualReminders: boolean,
  urgentDeadlineAlerts: boolean,
  currentLanguage: string,
  firstLaunch: boolean,
}

export const default_settings : ISettingsHome = {
  id: 1,
  darkMode: false,
  reminders: true,
  manualReminders: false,
  urgentDeadlineAlerts: false,
  currentLanguage: '',
  firstLaunch: true,
}
