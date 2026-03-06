import {Injectable} from '@angular/core';
import {defaultFilterInterface, FilterInterface} from "../interface/filter-interface";
import {BehaviorSubject, map, Observable} from "rxjs";
import {FilterDB} from "./filter-db";
import {TranslateService} from "@ngx-translate/core";
import {FilterDateEnum} from "../enum/filter-date-enum";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filtersSubject = new BehaviorSubject<FilterInterface>(defaultFilterInterface);
  filters$ = this.filtersSubject.asObservable();

  private db = new FilterDB();

  constructor(private translate: TranslateService) {}

  async initFilters() {
    const stored = await this.db.filters.get(1);

    if (!stored) await this.db.filters.put(defaultFilterInterface, 1);

    await this.refreshValues();
  }

  async refreshValues() {
    const allValues = await this.db.filters.get(1);
    if (!allValues) return;
    this.filtersSubject.next(allValues);

    console.log(allValues);
  }

  async changeFiltersValue(filtersValue: FilterInterface) {
    this.db.filters.put(filtersValue,1);
    await this.refreshValues();
  }

  calculateDateFilter(deadline: string): boolean {
    const filters = this.filtersSubject.value;

    const deadlineMs = new Date(deadline).getTime(); // Deadline en ms

    const now = new Date(); //Date maintenant
    const nowMs = Date.now();

    switch (this.getDateValue) {
      case FilterDateEnum.Today:
        // de 00h à 23h59
        const minTodayMs = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const maxTodayMs = new Date(now.setHours(23, 59, 59, 59)).getTime();

        return deadlineMs >= minTodayMs && deadlineMs <= maxTodayMs;

      case FilterDateEnum.Soon:
        const threeDaysMs = 72 * 60 * 60 * 1000;

        return deadlineMs >= nowMs && deadlineMs <= nowMs + threeDaysMs;

      case FilterDateEnum.Week:

        const firstDay = new Date(now.setDate(now.getDate() - (now.getDay() + 6) % 7));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(now.setDate(firstDay.getDate() + 6));
        lastDay.setHours(23, 59, 59, 999);

        return deadlineMs >= firstDay.getTime() && deadlineMs <= lastDay.getTime();

      case FilterDateEnum.Month:

        const firstDayMonth = new Date(now.setDate(1));
        firstDayMonth.setHours(0, 0, 0, 0);

        const lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayMonth.setHours(23, 59, 59, 999);


        console.log(firstDayMonth, lastDayMonth);

        return deadlineMs >= firstDayMonth.getTime() && deadlineMs <= lastDayMonth.getTime();

      case FilterDateEnum.CustomDate:

        const startDate = filters.customDate?.start
          ? new Date(filters.customDate.start).getTime()
          : null;
        const endDate = filters.customDate?.end
          ? new Date(filters.customDate.end).getTime()
          : null;

        return startDate !== null && endDate !== null
          ? deadlineMs >= startDate && deadlineMs <= endDate
          : false;

      default:
        return true;
    }
  }

  get getDateValue(){return this.filtersSubject.value.date;}
  get getCurrentLang(): string {return this.translate.getCurrentLang();}

  getDateStringValue(value: string){return this.translate.instant(`FILTER.${value}`);}
}
