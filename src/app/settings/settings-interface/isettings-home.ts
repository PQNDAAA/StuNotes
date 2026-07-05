export interface ISettingsHome {
  id: number,
  darkMode: string,
  reminders: boolean,
  manualReminders: boolean,
  urgentDeadlineAlerts: boolean,
  currentLanguage: string,
  firstLaunch: boolean,
  taskReminders: boolean,
}

export const default_settings : ISettingsHome = {
  id: 1,
  darkMode: "light-mode",
  reminders: true,
  manualReminders: false,
  urgentDeadlineAlerts: false,
  currentLanguage: '',
  firstLaunch: true,
  taskReminders: false,
}
