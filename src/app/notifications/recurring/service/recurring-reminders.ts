import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Card} from "../../../cards/cards-interface/card";
import {RecurringRemindersEnum} from "../enum/recurring-reminders-enum";

@Injectable({
  providedIn: 'root',
})
export class RecurringReminders {


  constructor(private translate: TranslateService) {}

  getRecurringReminders(recurringReminders: RecurringRemindersEnum): string{
    let value = "";
    this.translate.get(`RECURRINGREMINDERS.${recurringReminders}`).subscribe(string => {
      value = string;
    });
    return value;
  }

  calculateRecurringReminders(card: Card): Date[]{
    const deadlineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    switch (card.reminder.recurringReminders) {
      case RecurringRemindersEnum.EveryHour:
        const remindersEveryHour : Date[] = [];

        const hours = Math.round(diff / 1000 / 3600);
        console.log(hours);

        for (let i = 0; i <= hours - 1; i++) {
          const newDate = new Date(deadlineMs);
          newDate.setHours(newDate.getHours() - i,0,0,0);
          remindersEveryHour.push(newDate);
          console.log(newDate);
        }
        return remindersEveryHour;
      default:
        return [];
    }
  }

  checkRecurringReminders(selectedRecurringReminders: RecurringRemindersEnum, deadline: string): boolean {
    const deadlineMs = new Date(deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    switch(selectedRecurringReminders){
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
        return diff >= nextMonth.getTime();
      case RecurringRemindersEnum.EveryYear:
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return diff >= nextYear.getTime();
      default:
        return false;
    }
  }
}
