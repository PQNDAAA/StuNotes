import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {Card} from "../cards-interface/card";
import Dexie, {Table} from 'dexie';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../addnote/addnote.component";
import {Cardstatus} from "../cardstatus";
import {CardstatusColors} from "../cardstatus-colors";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {LocalNotificationService} from "../../local-notification-service";

@Injectable({
  providedIn: 'root'
})
export class CardsService extends Dexie {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  cards$ = this.cardsSubject.asObservable();

  cards!: Table<Card, number>;

  statusColors = CardstatusColors;

  constructor(private mc: ModalController, private lns: LocalNotificationService) {
    super('CardsDB');
    this.version(2).stores({
      cards: '++id, name, description, tag, createdAt, status, important, deadline, taskId'
    });
    this.cards = this.table('cards');

    this.refreshCards();
  }

  async getCards(): Promise<Card[]> {
    return this.cards.toArray();
  }

  async refreshCards() {
    const allCards = await this.getCards();
    this.cardsSubject.next(allCards);
  }

  async addCard(card: Card) {
    const newCard: Card = card;

    const id = await this.cards.add(newCard);

    newCard.taskId = await this.lns.CreateLocalNotification(this.lns.CalculateSchedule(newCard), newCard);
    await this.updateCard(newCard);

    await this.refreshCards();
    return id;
  }

  async resetCards() {
    this.cards.clear();
    await this.refreshCards();
  }

  async deleteCard(card: Card) {
    if (card.id !== undefined) {
      await this.lns.clearScheduled(card.taskId);
      this.cards.delete(card.id);

      await this.refreshCards();
      await Haptics.impact({style: ImpactStyle.Medium});
      console.log(this.getCards());
    } else {
      console.log("ID Error");
    }
  }

  async deleteAllCards(): Promise<boolean> {
    const cards = await this.getCards();

    if (!cards || cards.length === 0) {
      return false;
    } else {
      await this.lns.clearAll(); // clear all scheduled
      this.cards.clear(); // clear all cards

      await this.refreshCards();
      await Haptics.impact({style: ImpactStyle.Medium});
      return true;
    }
  }

  async openPopupEditCard(card: Card) {
    const modal = await this.mc.create({
      component: AddnoteComponent,
      componentProps: {
        card: card,
        isEditable: true
      }
    });
    await modal.present();
  }

  async updateCard(cardEdited: Card) {

    const cards = await this.getCards();
    const id = cards.findIndex(card => card.id === cardEdited.id);

    if (id !== -1) {
      if (cardEdited.status === Cardstatus.Finished && cardEdited.taskId.length !== 0) {
        await this.lns.clearScheduled(cardEdited.taskId);
        cardEdited.taskId = [];
      }
      cards[id] = cardEdited;
      await this.cards.put(cards[id]);
    } else {
      console.log("ID Error.");
    }
    await this.refreshCards();
  }

  filterCardsCount(status: Cardstatus): Observable<number> {
    return this.cards$.pipe(map(cards => cards.filter(c => c.status.trim() === status).length));
  }

  getStatusColor(status: string): string {
    const normalized = status.trim() as Cardstatus;

    return this.statusColors[normalized];
  }
}
