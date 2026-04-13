import { Injectable } from '@angular/core';
import Dexie, {Table} from "dexie";
import {Card} from "../cards-interface/card";

@Injectable({
  providedIn: 'root',
})
export class CardsDB extends Dexie {

  cards!: Table<Card, number>;

  constructor() {
    super('CardsDB');
    this.version(2).stores({
      cards: '++id, name, description, tag, createdAt, status, important, deadline, reminder'
    });
    this.cards = this.table('cards');
  }

  clearCards(){
    this.cards.clear();
  }
}
