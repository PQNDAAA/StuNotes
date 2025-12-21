import { Injectable } from '@angular/core';
import {Tags} from "../tags";
import Dexie, { Table } from 'dexie';
import { BehaviorSubject } from 'rxjs';
import {Haptics, ImpactStyle} from "@capacitor/haptics";

@Injectable({
  providedIn: 'root'
})
export class TagsService extends Dexie{
  private tagsSubject = new BehaviorSubject<Tags[]>([]);
  tags$ = this.tagsSubject.asObservable();

  tags!: Table<Tags, number>;

  constructor() {
    super('TagsDB');
    this.version(1).stores({
      tags: '++id, name'
    });
    this.tags = this.table('tags');

    this.refreshTags();
  }

  getTags() : Promise<Tags[]> {
    return this.tags.toArray();
  }

  async addTag(tag : Tags){
    const id = await this.tags.add(tag);
    tag.id = id;

    await this.refreshTags();
    return id;
  }

  async deleteTag(id : number){

    this.tags.delete(id);

    await this.refreshTags();
    await Haptics.impact({style: ImpactStyle.Medium});
    console.log("Tag deleted.");
  }

  async deleteAllTags() : Promise<boolean> {
    const tags = await this.getTags();

    if(!tags || tags.length === 0){
      return false;
    } else {
      this.tags.clear();
      await this.refreshTags();
      await Haptics.impact({style: ImpactStyle.Medium});
      return true;
    }
  }

  async refreshTags(){
    const allTags = await this.getTags();
    this.tagsSubject.next(allTags);
  }
}
