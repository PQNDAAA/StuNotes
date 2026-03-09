import {Injectable} from '@angular/core';
import {Manualreminders} from "../cards-enum/manualreminders";
import {TranslateService} from "@ngx-translate/core";
import {Card} from "../cards-interface/card";

@Injectable({
  providedIn: 'root',
})
export class CardManualreminders {


  constructor(private translate: TranslateService) {}

  getManualReminders(manualReminder: Manualreminders): string{
    let value = "";
    this.translate.get(`MANUALREMINDERS.${manualReminder}`).subscribe(string => {
      value = string;
    });
    return value;
  }

  calculateManualReminders(card: Card): Date[]{
    const deadlineMs = new Date(card.deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    switch (card.manualReminders) {
      case Manualreminders.EveryHour:

        const remindersEveryHour : Date[] = [];

        const hours = Math.round(diff / 1000 / 3600);
        console.log(hours);

        for (let i = 0; i <= hours - 1; i++) {
          const newDate = new Date(deadlineMs);
          newDate.setHours(newDate.getHours() - i,0,0,0);
          remindersEveryHour.push(newDate);
          console.log(newDate);
        }
        //18h01 > 21h01 = 3h rappels : 19h, 20h, 21h
        return remindersEveryHour;
      default:
        return [];
    }
  }

  checkManualReminders(selectedManualReminders: Manualreminders, deadline: string): boolean {
    const deadlineMs = new Date(deadline).getTime();
    const now = Date.now();
    const diff = deadlineMs - now;

    switch(selectedManualReminders){
      case Manualreminders.Never:
        return true;
      case Manualreminders.CustomReminder:
        return true;
      case Manualreminders.EveryHour:
        return diff >= 60 * 60 * 1000;
      case Manualreminders.EveryThreeHours:
        return diff >= 3 * 60 * 60 * 1000;
      case Manualreminders.EveryDay:
        return diff >= 24 * 60 * 60 * 1000;
      case Manualreminders.EveryTwoDays:
        return diff >= 2 * 24 * 60 * 60 * 1000;
      case Manualreminders.EveryWeek:
        return diff >= 7 * 24 * 60 * 60 * 1000;
      case Manualreminders.EveryMonth:
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return diff >= nextMonth.getTime();
      case Manualreminders.EveryYear:
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return diff >= nextYear.getTime();
      default:
        return false;
    }
  }
}
