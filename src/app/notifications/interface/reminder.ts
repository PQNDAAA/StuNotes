import {RecurringRemindersEnum} from "../recurring/enum/recurring-reminders-enum";
import {ReminderTypeEnum} from "../types/reminder-type-enum";

export interface Reminder {
  type: ReminderTypeEnum;
  smartReminders?: boolean;
  recurringReminders?: RecurringRemindersEnum;
}
