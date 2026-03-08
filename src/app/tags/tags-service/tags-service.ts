import { Injectable } from '@angular/core';
import {Tags} from "../tags-interface/tags";
import Dexie, { Table } from 'dexie';
import { BehaviorSubject } from 'rxjs';
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {ModalController} from "@ionic/angular";
import {AddtagComponent} from "../addtag/addtag.component";
import {TagsDB} from "../tags-db/tags-db";

@Injectable({
  providedIn: 'root'
})
export class TagsService{
  private tagsSubject = new BehaviorSubject<Tags[]>([]);
  tags$ = this.tagsSubject.asObservable();

  db = new TagsDB();

  constructor() {}

  async initTags(){
    await this.refreshTags();
  }

  getTags() : Promise<Tags[]> {return this.getTagsDB.toArray();}
  get getTagsDB() {return this.db.tags;}

  async addTag(tag : Tags){
    const id = await this.getTagsDB.add(tag);
    tag.id = id;

    await this.refreshTags();
    return id;
  }

  async deleteTag(id : number){
    this.getTagsDB.delete(id);
    await this.refreshTags();
    await Haptics.impact({style: ImpactStyle.Medium});
    console.log("Subject deleted.");
  }

  async updateTag(tagEdited: Tags){
    const tags = await this.getTags();
    const id = tags.findIndex(tag => tag.id === tagEdited.id);

    if(id !== -1){
      tags[id] = tagEdited;
      await this.getTagsDB.put(tags[id]);
    }
    await this.refreshTags();
  }

  async deleteAllTags() : Promise<boolean> {
    const tags = await this.getTags();

    if(!tags) return false;

      this.db.clearTags();
      await this.refreshTags();
      await Haptics.impact({style: ImpactStyle.Medium});
      return true;
  }

  async refreshTags(){
    const allTags = await this.getTags();
    this.tagsSubject.next(allTags);
    console.log(allTags);
  }
}
