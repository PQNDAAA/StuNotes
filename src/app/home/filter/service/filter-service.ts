import {Injectable} from '@angular/core';
import {defaultFilterInterface, FilterInterface} from "../interface/filter-interface";
import {BehaviorSubject, map, Observable} from "rxjs";
import {FilterDB} from "./filter-db";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  filtersSubject = new BehaviorSubject<FilterInterface>(defaultFilterInterface);
  filters$ = this.filtersSubject.asObservable();

  private db = new FilterDB();

  constructor(private translate: TranslateService) {
  }

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

  get getCurrentLang(): string {return this.translate.getCurrentLang();}

  getDateStringValue(value: string){return this.translate.instant(`FILTER.${value}`);}
}
