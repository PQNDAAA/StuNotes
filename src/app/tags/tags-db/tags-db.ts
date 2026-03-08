import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {Tags} from "../tags-interface/tags";

@Injectable({
  providedIn: 'root',
})
export class TagsDB extends Dexie{

  tags!: Table<Tags, number>;

  constructor() {
    super('TagsDB');
    this.version(1).stores({
      tags: '++id, name'
    });
    this.tags = this.table('tags');
  }

  clearTags(){
    this.tags.clear();
  }

}
