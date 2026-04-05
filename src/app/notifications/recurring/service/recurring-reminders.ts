import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Card} from "../../../cards/cards-interface/card";
import {RecurringRemindersEnum} from "../enum/recurring-reminders-enum";

@Injectable({
  providedIn: 'root',
})
export class RecurringReminders {


  constructor(private translate: TranslateService) {
  }

  getRecurringReminders(recurringReminders: RecurringRemindersEnum): string {
    let value = "";
    this.translate.get(`RECURRINGREMINDERS.${recurringReminders}`).subscribe(string => {
      value = string;
    });
    return value;
  }

  calculateRecurringReminders(card: Card): Date[] {
    const deadlineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    const hours = Math.round(diff / 1000 / 3600);
    const days = Math.round(hours / 24);

    switch (card.reminder.recurringReminders) {
      case RecurringRemindersEnum.EveryHour:
        const remindersEveryHour: Date[] = [];

        const baseDate = new Date(deadlineMs);
        baseDate.setHours(baseDate.getHours(), 0, 0 ,0);

        for (let i = 0; i <= hours - 1; i++) {
          const newDate = new Date(baseDate);
          newDate.setHours(baseDate.getHours() - i);
          remindersEveryHour.push(newDate);
        }
        return remindersEveryHour;

      case RecurringRemindersEnum.EveryThreeHours:
        const remindersEveryThreeHours: Date[] = [];
        const remindersNumberTH = Math.floor(hours / 3);

        for (let i = 1; i <= remindersNumberTH; i++) {
          const newDate = new Date(now);
          newDate.setHours(newDate.getHours() + 3 * i);
          remindersEveryThreeHours.push(newDate);
        }
        return remindersEveryThreeHours;

      case RecurringRemindersEnum.EveryDay:
        let remindersEveryDay: Date[] = [];
        remindersEveryDay = this.generateDatesDaysUntilDeadline(now, 1, deadlineMs, days);
        return remindersEveryDay;

      case RecurringRemindersEnum.EveryTwoDays:
        let remindersEveryTwoDays: Date[] = [];
        const numberRemindersTD = days / 2;
        remindersEveryTwoDays = this.generateDatesDaysUntilDeadline(now, 2, deadlineMs, numberRemindersTD);
        return remindersEveryTwoDays;

      case RecurringRemindersEnum.EveryWeek:
        let remindersEveryWeek: Date[] = [];
        const numberRemindersEW = Math.ceil(days / 7);
        console.log(numberRemindersEW);
        remindersEveryWeek = this.generateDatesDaysUntilDeadline(now, 7, deadlineMs, numberRemindersEW);
        return remindersEveryWeek;

        case RecurringRemindersEnum.EveryMonth:
          let remindersEveryMonth: Date[] = [];
          const deadline = new Date(card.deadline);
          const numberRemindersEM = Math.ceil(((deadline.getMonth() + 1) - (new Date(now).getMonth() + 1)));

          for (let i = 1; i <= numberRemindersEM; i++) {
            let newDate = new Date(now);
            newDate.setMonth(newDate.getMonth() + i);
            newDate = this.ensureBeforeDeadline(newDate, deadlineMs);
            remindersEveryMonth.push(newDate);
          }
          return remindersEveryMonth;
      default:
        return [];
    }
  }

  private generateDatesDaysUntilDeadline(now: number, days: number, deadlineMs: number, numberRemindersRemaining: number): Date[] {
    const reminders: Date[] = [];

    for (let i = 1; i <= numberRemindersRemaining; i++) {
      let newDate = new Date(now);
      newDate.setDate(newDate.getDate() + days * i);
      newDate = this.ensureBeforeDeadline(newDate, deadlineMs);

      reminders.push(newDate);
      console.log(newDate);
    }
    return reminders;
  }

  checkRecurringReminders(selectedRecurringReminders: RecurringRemindersEnum, deadline: string): boolean {
    const deadlineMs = new Date(deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    switch (selectedRecurringReminders) {
      case RecurringRemindersEnum.Never:
        return true;
      case RecurringRemindersEnum.EveryHour:
        return diff >= 60 * 60 * 1000;
      case RecurringRemindersEnum.EveryThreeHours:
        return diff >= 3 * 60 * 60 * 1000;
      case RecurringRemindersEnum.EveryDay:
        return diff >= 24 * 60 * 60 * 1000;
      case RecurringRemindersEnum.EveryTwoDays:
        return diff >= 2 * 24 * 60 * 60 * 1000;
      case RecurringRemindersEnum.EveryWeek:
        return diff >= 7 * 24 * 60 * 60 * 1000;
      case RecurringRemindersEnum.EveryMonth:
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return deadlineMs >= nextMonth.getTime();
      default:
        return false;
    }
  }

  private ensureBeforeDeadline(date: Date, deadlineMs: number): Date {
    return date.getTime() > deadlineMs ? new Date(deadlineMs) : date;
  }
}
