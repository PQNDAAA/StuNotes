import {RecurringRemindersEnum} from "./recurring-reminders-enum";

const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);

const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

export const RecurringInterval: {[key in RecurringRemindersEnum]: number} = {

  [RecurringRemindersEnum.Never]: 0,
  [RecurringRemindersEnum.EveryDay]: 24 * 60 * 60 * 1000,
  [RecurringRemindersEnum.EveryHour]: 60 * 60 * 1000,
  [RecurringRemindersEnum.EveryWeek]: 7 * 24 * 60 * 60 * 1000,
  [RecurringRemindersEnum.EveryThreeHours]: 3 * 60 * 60 * 1000,
  [RecurringRemindersEnum.EveryTwoDays]: 2 * 24 * 60 * 60 * 1000,
  [RecurringRemindersEnum.EveryMonth]: nextMonth.getTime(),
  [RecurringRemindersEnum.EveryYear]: nextYear.getTime(),
}
