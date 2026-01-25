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
import {car} from "ionicons/icons";

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

    //Subscribe to this event
    this.lns.notificationReceived$.subscribe(id => this.removeTaskId(id));
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

    if (newCard.status.trim() !== Cardstatus.Finished) {
      newCard.taskId = await this.lns.CreateLocalNotification(this.lns.CalculateSchedule(newCard), newCard);
      this.cards.put(newCard);
    }
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
    const oldCard = cards[id];

    if (id !== -1) {
      cardEdited = await this.processUpdateCard(oldCard, cardEdited);
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

  async removeTaskId(id: number) {
    const allCards = await this.getCards();

    for (const card of allCards) {
      if (card.taskId.includes(id)) {
        card.taskId = card.taskId.filter(ids => ids !== id);
        await this.cards.put(card);
      }
    }
    await this.refreshCards();
  }

  getStatusColor(status: string): string {
    const normalized = status.trim() as Cardstatus;

    return this.statusColors[normalized];
  }

  toLocalISOString(date: Date) {
    const offset = date.getTimezoneOffset() * 60000; // retourne juste un nombre en ms
    return new Date(date.getTime() - offset).toISOString().slice(0, -1);
    // GetTime va nous servir a ajuster la date par rapport a notre offset (ex : date en UTC , offset = -60min donc
    // date = UTC + 60min ce qui donne la date au moment present
  }

  async updateOverdueTasks() {
    const allCards = await this.getCards();
    const now = Date.now();

    for (const card of allCards) {
      const deadLineMs = new Date(card.deadline).getTime();

      if (card.status.trim() !== Cardstatus.Finished && card.status.trim() !== Cardstatus.Late
        && deadLineMs < now) {
        card.status = Cardstatus.Late;
        console.log("Le statut de la tâche n°", card.id + " a bien été changé dû à son échéance", card);
        await this.cards.put(card);
      }
    }
    await this.refreshCards();
  }

  async processUpdateCard(oldCard: Card, card: Card) {

    const hasFinished = card.status.trim() === Cardstatus.Finished;
    const taskId = card.taskId.length !== 0;

    const deadLineHasChanged = oldCard.deadline !== card.deadline;

    if (hasFinished && taskId) {
      await this.lns.clearScheduled(card.taskId);
      card.taskId = [];
    } else if (!hasFinished && deadLineHasChanged && taskId) {
      await this.lns.clearScheduled(card.taskId);
      card.taskId = await this.lns.CreateLocalNotification(this.lns.CalculateSchedule(card), card);
    } else if (!hasFinished && !taskId) {
      card.taskId = await this.lns.CreateLocalNotification(this.lns.CalculateSchedule(card), card);
    }
    return card;
  }
}
