import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Card} from "../cards-interface/card";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardstatusColors} from "../cards-const/cardstatus-colors";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {LocalNotificationService} from "../../notifications/local-notification/local-notification-service";
import {CardsDB} from "../db/cards-db";
import {Settings} from "../../settings/settings-service/settings";
import {ReminderTypeEnum} from "../../notifications/types/reminder-type-enum";
import {LocalNotifications} from "@capacitor/local-notifications";

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
    this.lns.notificationReceived$.subscribe(notification => this.removeTaskId(notification.id,
      notification.customReminder));
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
      card.taskId = await this.handleReminderByType(card);
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
      await this.clearScheduledTasks(card.taskId);
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

    if(id === -1) return console.log("ID Error.");

      cardEdited = await this.processUpdateCard(oldCard, cardEdited);
      cards[id] = cardEdited;

      await this.getCardsDB.put(cards[id]);
      await this.refreshCards();
  }
// A TRIER ( promise.all et faire var)
  async removeTaskId(id: number, notifcation: number) {
    const allCards = await this.getCards();

    for (const card of allCards) {
      if (card.taskId.includes(id)) {
        card.taskId = card.taskId.filter(ids => ids !== id);

        if(card.reminder.type === ReminderTypeEnum.CustomReminder &&
          card.reminder.customReminders?.reminders.includes(notifcation)){
          card.reminder.customReminders.reminders = card.reminder.customReminders.reminders.filter(
            reminder => reminder !== notifcation);
        }
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

  async syncOverdueTasks() {
    const allCards = await this.getCards();
    const now = Date.now();
    const overdueCards = allCards.filter(card => card.status.trim() !== Cardstatus.Done &&
      card.status.trim() !== Cardstatus.Late && new Date(card.deadline).getTime() < now);

    await Promise.all(overdueCards.map(async (card) => {
      card.status = Cardstatus.Late;
      console.log("Le statut de la tâche n°", card.id + " a bien été changé dû à son échéance", card);
      await this.getCardsDB.put(card);
    }));
    await this.refreshCards();
  }

  //A REFAIRE SELON RESULTAT
  async syncTaskReminders(){
    const allCards = await this.getCards();
    const currentNotifications = await LocalNotifications.getPending();
    const idsNotifications = currentNotifications.notifications.map(
      notification => notification.id);
    const notifications = currentNotifications.notifications.map(
      notification =>
        notification.extra.customReminders
      );


    for (const card of allCards) {
      //const hasReminderType = card.reminder.type !== ReminderTypeEnum.None;
      const activeReminders = card.taskId.filter(ids => idsNotifications.includes(ids));

      if(activeReminders.length !== card.taskId.length) {
        card.taskId = activeReminders;
        console.log("La synchronisation des id des rappels a été faite avec succés sur cette tâche", card);
      }
      if(card.reminder.type === ReminderTypeEnum.CustomReminder
        && card.reminder.customReminders?.reminders){
        const activeCustomReminders = card.reminder.customReminders?.reminders.filter(
          customReminder => notifications.includes(customReminder));
        if(activeCustomReminders.length !== card.reminder.customReminders.reminders.length){
          card.reminder.customReminders.reminders = activeCustomReminders;
          console.log("La suppression des id des rappels personnalisés a été effectuée avec succés", card);
        }
      }
      await this.getCardsDB.put(card);
    }
    await this.refreshCards();
  }

  async reBuildRemindersForCards() {
    const allCards = await this.getCards();
    const activeCards = allCards.filter(card =>
      ![Cardstatus.Late, Cardstatus.Done].includes(card.status));

    await Promise.all(activeCards.map(async card => {
      card.taskId = await this.handleReminderByType(card);
      await this.getCardsDB.put(card);
    }));
    await this.refreshCards();
  }

  async processUpdateCard(oldCard: Card, card: Card) {
    const hasFinished = card.status.trim() === Cardstatus.Done;
    const isLate = card.status.trim() === Cardstatus.Late;

    const hasTaskId = card.taskId.length !== 0;

    const customReminderChanged = oldCard.reminder.customReminders?.reminders.length !==
      card.reminder.customReminders?.reminders.length;
    const deadLineHasChanged = oldCard.deadline !== card.deadline;
    const reminderTypeChanged = oldCard.reminder.type !== card.reminder.type;
    const recurringReminderTypeChanged = oldCard.reminder.recurringReminders !== card.reminder.recurringReminders;

    if(hasFinished || isLate) {
      if(hasTaskId) {
        await this.clearScheduledTasks(card.taskId);
        card.taskId = [];
      }
      return card;
    }

    if(hasTaskId && (deadLineHasChanged || reminderTypeChanged || recurringReminderTypeChanged
      || customReminderChanged)) {
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
        return await this.lns.createLocalNotifications(await this.checkCustomReminders(card), card);
      default:
        console.log("none");
        return [];
    }
  }

  async getCardById(id: number): Promise<Card | undefined> {
    const cards = await this.getCards();
    return cards.find(card => card.id === id);
  }
// A TRIER avec la fonction dans custom reminder modal .ts
  async checkCustomReminders(card: Card) {
    let currentCustomReminders = card.reminder.customReminders?.reminders;
    if (!currentCustomReminders) return [];

    const correctCustomReminders = this.getCorrectCustomReminders(card);
    if (!correctCustomReminders || correctCustomReminders.length === 0) return []

    const dates = correctCustomReminders.map(date => new Date(date));

      const isDifferent = correctCustomReminders.length !== currentCustomReminders.length;
      if(isDifferent && card.reminder.customReminders?.reminders){
        card.reminder.customReminders.reminders = correctCustomReminders;
        await this.getCardsDB.put(card);
        console.log("Reminders updated");
    }
    return dates;
  }

  getCorrectCustomReminders(card: Card) {
    return card.reminder.customReminders?.reminders.filter(
      reminder => reminder <= new Date(card.deadline).getTime()
        && reminder >= Date.now());
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
