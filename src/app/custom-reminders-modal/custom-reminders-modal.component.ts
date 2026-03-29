import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Card} from "../cards/cards-interface/card";
import {CardsService} from "../cards/cards-service/cards-service";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject, map, take} from "rxjs";
import {AsyncPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-custom-reminders-modal',
  templateUrl: './custom-reminders-modal.component.html',
  styleUrls: ['./custom-reminders-modal.component.scss'],
  imports: [
    IonicModule,
    AsyncPipe,
    NgForOf
  ]
})
export class CustomRemindersModalComponent  implements OnInit {

  @Input() cardEdited!: Card;

  customReminders$ = new BehaviorSubject<number[]>([]);
  results$ = this.customReminders$.asObservable();

  customRemindersA:number[] = []


  customReminder: Date = new Date();

  constructor(private cs: CardsService, private translate: TranslateService) { }

  ngOnInit() {}

  onCustomRemindersChanged(event: any) {
    this.customReminder = new Date(event.target.value);
  }

  async validCustomDate() {
    const customDate = this.customReminder;

    this.customReminders$.pipe(take(1),
      map(customReminders =>
    customReminders.includes(customDate.getTime()))
    ).subscribe(value => {
      if(value){
        console.log("Le rappel a cette heure-ci a déjà été ajouté ", value);
      } else {
        this.customRemindersA.push(customDate.getTime());
        this.customReminders$.next(this.customRemindersA);
      }
    });

    for (const date of this.customRemindersA) {
      console.log(new Date(date));
    }
  }

  get getMinDate(): string {
    return this.cs.toLocalISOString(new Date(), false);
  }

  get getMaxDate() : string {
    return this.cs.toLocalISOString(new Date(this.cardEdited.deadline), false);
  }

  get getCurrentLang(): string {
    return this.translate.getCurrentLang();
  }

  getCustomReminders(dateMs : number){
    console.log("getCustomReminders", dateMs);
    return new Date(dateMs).toLocaleString(this.getCurrentLang,
      {
        year: "numeric",
        month:"long",
        day:"numeric",
        hour: "numeric",
        minute:"2-digit"
      });
  }

}
