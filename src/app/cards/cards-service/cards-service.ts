import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable} from 'rxjs';
import {Card} from "../cards-interface/card";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardstatusColors} from "../cards-const/cardstatus-colors";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {LocalNotificationService} from "../../notifications/local-notification/local-notification-service";
import {CardsDB} from "../db/cards-db";
import {Settings} from "../../settings/settings-service/settings";
import {ReminderTypeEnum} from "../../notifications/types/reminder-type-enum";

@Injectable({
  providedIn: 'root'
})
export class CardsService {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  cards$ = this.cardsSubject.asObservable();

  private countCards = new BehaviorSubject<Map<Cardstatus, number>>(new Map());
  countCards$ = this.countCards.asObservable();

  statusColors = CardstatusColors;

  private db = new CardsDB();


  constructor(private lns: LocalNotificationService, private settingsService: Settings) {
    //Subscribe to this event
    this.lns.notificationReceived$.subscribe(id => this.removeTaskId(id));
    this.lns.notificationGranted$.subscribe(value => this.reBuildRemindersForCards());
  }

  async initCards() {
    await this.refreshCards();
  }

  get getCardsDB() {
    return this.db.cards;
  }

  async getCards(): Promise<Card[]> {
    return this.getCardsDB.toArray();
  }

  async refreshCards() {
    const allCards = await this.getCards();
    this.cardsSubject.next(allCards);
    console.log(allCards);
  }

  refreshCountCards(cardsFilter: Card[]) {
    const countCards = new Map<Cardstatus, number>();

    Object.values(Cardstatus).forEach((status) => {
      countCards.set(status, cardsFilter.filter(card => card.status === status).length);
    })
    this.countCards.next(countCards);
  }


  //UPDATE
  async addCard(card: Card) {
    const reminderType = card.reminder.type;
    const cardStatus = card.status.trim();
    const isActive = cardStatus !== Cardstatus.Done && cardStatus !== Cardstatus.Late;
    const hasReminderType = reminderType !== ReminderTypeEnum.None;

    const id = await this.getCardsDB.add(card);

    card.id = id;

    if (isActive && hasReminderType) {
      await this.handleReminderByType(card);
    }
    await this.getCardsDB.put(card);
    await this.refreshCards();
    return id;
  }

  async resetCards() {
    this.clearCards();
    await this.refreshCards();
  }

  async deleteCard(card: Card) {
    if (card.id !== undefined) {
      await this.clearScheduledTasks(card.taskId); // A REFAIRE
      await this.getCardsDB.delete(card.id);

      await this.refreshCards();
      await Haptics.impact({style: ImpactStyle.Medium});
    } else {
      console.log("ID Error");
    }
  }

  async deleteAllCards(): Promise<boolean> {
    const cards = await this.getCards();

    if (!cards || cards.length === 0) {
      return false;
    } else {
      await this.lns.clearAllScheduledTasks(); // clear all scheduled
      this.clearCards(); // clear all cards

      await this.refreshCards();
      await Haptics.impact({style: ImpactStyle.Medium});
      return true;
    }
  }

  async updateCard(cardEdited: Card) {

    const cards = await this.getCards();
    const id = cards.findIndex(card => card.id === cardEdited.id);
    const oldCard = cards[id];

    if (id !== -1) {
      cardEdited = await this.processUpdateCard(oldCard, cardEdited);
      cards[id] = cardEdited;
      await this.getCardsDB.put(cards[id]);
      await this.refreshCards();
    } else {
      console.log("ID Error.");
    }
  }

  filterCardsCount(status: Cardstatus): Observable<number> {
    return this.cards$.pipe(map(cards => cards.filter(c => c.status.trim() === status)
      .length));
  }

  async removeTaskId(id: number) {
    const allCards = await this.getCards();

    for (const card of allCards) {
      if (card.taskId.includes(id)) {
        card.taskId = card.taskId.filter(ids => ids !== id);
        await this.getCardsDB.put(card);
      }
    }
    await this.refreshCards();
  }

  getStatusColor(status: string): string {
    const normalized = status.trim() as Cardstatus;
    return this.statusColors[normalized];
  }

  toLocalISOString(date: Date, hasBuffer: boolean) {
    const offset = date.getTimezoneOffset() * 60000; // retourne juste un nombre en ms
    const minBuffer = 60 * 60 * 1000; //On définit un min buffer pour bien calculer les rappels intelligents

    return hasBuffer ? new Date(date.getTime() - offset + minBuffer).toISOString().slice(0, -1)
      : new Date(date.getTime() - offset).toISOString().slice(0, -1);
    // GetTime va nous servir a ajuster la date par rapport a notre offset (ex : date en UTC , offset = -60min donc
    // date = UTC + 60min ce qui donne la date au moment present
  }

  async updateOverdueTasks() {
    const allCards = await this.getCards();
    const now = Date.now();

    for (const card of allCards) {
      const deadLineMs = new Date(card.deadline).getTime();

      if (card.status.trim() !== Cardstatus.Done && card.status.trim() !== Cardstatus.Late
        && deadLineMs < now) {
        card.status = Cardstatus.Late;
        console.log("Le statut de la tâche n°", card.id + " a bien été changé dû à son échéance", card);
        await this.getCardsDB.put(card);
      }
    }
    await this.refreshCards();
  }

  async reBuildRemindersForCards() {
    const allCards = await this.getCards();
    const activeCards = allCards.filter(card =>
      ![Cardstatus.Late, Cardstatus.Done].includes(card.status));

    await Promise.all(activeCards.map(async card => {
      await this.handleReminderByType(card);
      await this.getCardsDB.put(card);
    }));
    await this.refreshCards();
  }

  async processUpdateCard(oldCard: Card, card: Card) {
    const hasFinished = card.status.trim() === Cardstatus.Done;
    const hasTaskId = card.taskId.length !== 0;
    const deadLineHasChanged = oldCard.deadline !== card.deadline;
    const reminderTypeChanged = oldCard.reminder.type !== card.reminder.type;

    if(hasFinished) {
      if(hasTaskId) {
        await this.clearScheduledTasks(card.taskId);
        card.taskId = [];
      }
      return card;
    }

    if(hasTaskId && (deadLineHasChanged || reminderTypeChanged)){
      await this.clearScheduledTasks(card.taskId);
      card.taskId = [];
    }

    if(card.taskId.length === 0){
     card.taskId = await this.handleReminderByType(card);
    }
    return card;
  }

  async handleReminderByType(card: Card) {
    switch (card.reminder?.type) {
      case ReminderTypeEnum.SmartReminder:
        return await this.createLocalNotifications(card);
      case ReminderTypeEnum.RecurringReminder:
        return await this.lns.createLocalNotifications(this.lns.calculateRecurringReminders(card),
          card);
      case ReminderTypeEnum.CustomReminder:
        return await this.lns.createLocalNotifications(this.checkCustomReminders(
          this.convertCustomRemindersToDates(card)), card);
      default:
        console.log("default");
        return [];
    }
  }

  async getCardById(id: number): Promise<Card | undefined> {
    const cards = await this.getCards();
    return cards.find(card => card.id === id);
  }

  convertCustomRemindersToDates(card: Card) {
    const dates: Date[] = [];

    if (card.reminder.customReminders?.reminders) {
      for (const date of card.reminder.customReminders.reminders) {
        dates.push(new Date(date));
      }
    }
    return dates;
  }

  checkCustomReminders(dates: Date[]) {
    return dates.filter(date => date.getTime() >= Date.now());
  }

  clearCards() {
    this.db.clearCards();
  }

  async clearScheduledTasks(ids: number[]) {
    await this.lns.clearScheduledTasks(ids);
  }

  async createLocalNotifications(card: Card): Promise<number[]> {
    return await this.lns.createLocalNotifications(this.lns.calculateSchedule(card), card);
  }
}
