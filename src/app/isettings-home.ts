export interface ISettingsHome {
  id: number,
  darkMode: boolean,
  reminders: boolean,
  urgentDeadlineAlerts: boolean
}

export const default_settings : ISettingsHome = {
  id: 1,
  darkMode: false,
  reminders: false,
  urgentDeadlineAlerts: false
}
