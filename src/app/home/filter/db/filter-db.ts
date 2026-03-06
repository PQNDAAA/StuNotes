import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {FilterInterface} from "../interface/filter-interface";

@Injectable({
  providedIn: 'root',
})
export class FilterDB extends Dexie {

  filters!: Table<FilterInterface, number>;

  constructor() {
    super('FilterDB');
    this.version(2).stores({
      filters: '++id, important, tags, date, customDate'
    });
  }
}
