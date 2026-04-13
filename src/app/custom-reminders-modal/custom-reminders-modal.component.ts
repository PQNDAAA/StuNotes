import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Card} from "../cards/cards-interface/card";
import {CardsService} from "../cards/cards-service/cards-service";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, map, take} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";
import {CustomReminderViewModel} from "./custom-reminder-view-model";

@Component({
  selector: 'app-custom-reminders-modal',
  templateUrl: './custom-reminders-modal.component.html',
  styleUrls: ['./custom-reminders-modal.component.scss'],
  imports: [
    IonicModule,
    AsyncPipe,
    NgForOf,
    TranslatePipe
  ]
})
export class CustomRemindersModalComponent implements OnInit {

  @Input() card!: Card;
  @Output() customRemindersChange = new EventEmitter<number[]>();

  customReminders$ = new BehaviorSubject<CustomReminderViewModel[]>([]);
  results$ = this.customReminders$.asObservable();

  localCustomReminders: number[] = [];

  cardEdited!: Card;

  customReminder: Date = new Date(); // valeur visible actuellement

  minDate!: string;
  maxDate!: string;

  intervalId: any;

  constructor(private cs: CardsService, private translate: TranslateService) {}

  ngOnInit() {
    this.cardEdited = structuredClone(this.card);

    this.minDate = this.getMinDate;
    this.maxDate = this.getMaxDate;

    this.intervalId = setInterval(() => {
      this.updateMinDate();
    }, 1000);

    this.checkCustomReminders(this.cardEdited);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    console.log("Clear IntervalId");
  }

  checkCustomReminders(card: Card) {
    const currentCustomReminders = card.reminder.customReminders?.reminders;
    if(!currentCustomReminders || currentCustomReminders.length === 0) return;

    const correctCustomReminders = this.cs.getCorrectCustomReminders(card);
    if(!correctCustomReminders) return;

    if(correctCustomReminders.length > 0) {
      this.localCustomReminders = correctCustomReminders;
      this.customReminders$.next(this.localCustomReminders.map(v => ({
        dateMs: v,
        label: this.getCustomReminders(v)})));
      console.log("CustomReminders reminders found ", correctCustomReminders);
    }

    const isDifferent = currentCustomReminders.length !== correctCustomReminders.length;
    if(isDifferent) {
      this.emitCustomReminders(correctCustomReminders);
    }
  }

  onCustomRemindersChanged(event: any) {
    this.customReminder = new Date(event.target.value);
  }

  async validCustomDate() {
    const customDate = this.customReminder;

    this.customReminders$.pipe(take(1),
      map(v => v.map(date => date.dateMs)
        .includes(customDate.getTime()))
      ).subscribe(exists => {
      if (exists) {
        console.log("Le rappel a cette heure-ci a déjà été ajouté ", exists);
      } else {
        this.localCustomReminders.push(customDate.getTime());
        this.emitCustomReminders(this.localCustomReminders);

        const value : CustomReminderViewModel[] = this.localCustomReminders.map(n => ({
          dateMs: n,
          label: this.getCustomReminders(n)
        }))
        this.customReminders$.next(value);
      }
    });
    for (const date of this.localCustomReminders) {
      console.log(new Date(date));
    }
  }

  deleteCustomDate(date: number){
    const index = this.localCustomReminders.indexOf(date);

    console.log(index);

    if(index > -1){
      this.localCustomReminders.splice(index, 1);
      this.emitCustomReminders(this.localCustomReminders);
      this.customReminders$.next(this.localCustomReminders.map(v => ({
        dateMs:v,
        label: this.getCustomReminders(v)
      })));
    }
  }

  emitCustomReminders(numbers: number[]) {
    return this.customRemindersChange.emit(numbers);
  }

  get getMinDate(): string {
    return this.cs.toLocalISOString(new Date(), false);
  }

  get getMaxDate(): string {
    return this.cs.toLocalISOString(new Date(this.cardEdited.deadline), false);
  }

  private updateMinDate(){
    this.minDate = this.getMinDate;
  }

  get getCurrentLang(): string {
    return this.translate.getCurrentLang();
  }

  getCustomReminders(dateMs: number) {
    console.log("getCustomReminders", dateMs);
    return new Date(dateMs).toLocaleString(this.getCurrentLang,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      });
  }
}
