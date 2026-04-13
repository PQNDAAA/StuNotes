import {Component, Input, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {Tags} from "../../tags/tags-interface/tags";
import {TagsService} from "../../tags/tags-service/tags-service";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardStatusService} from "../cards-service/card-status-service";
import {TranslateService} from "@ngx-translate/core";
import {NgForm} from "@angular/forms";
import {RecurringRemindersEnum} from "../../notifications/recurring/enum/recurring-reminders-enum";
import {RecurringReminders} from "../../notifications/recurring/service/recurring-reminders";
import {ReminderTypeEnum} from "../../notifications/types/reminder-type-enum";
import {ReminderType} from "../../notifications/types/service/reminder-type";

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss'],
  standalone: false,
})
export class AddnoteComponent implements OnInit {

  //INPUT SOURCE
  @Input() card: Card = {
    reminder: {
      type: ReminderTypeEnum.None, recurringReminders: RecurringRemindersEnum.Never, customReminders: {reminders: []},
      remindersIds: []
    },
    deadline: this.cs.toLocalISOString(new Date(), true),
    important: false,
    status: Cardstatus.Open,
    createdAt: new Date(),
    description: "",
    name: "",
    tag: ""
  }
  @Input() isEditable: boolean = false;

  isOpen = false;

  //DATA SOURCE
  cardEdited!: Card;
  tags!: Tags[];
  statusValues = Object.values(Cardstatus);

  //UI
  minDeadline: string;

  //BOOLEAN
  noDeadLineVisibility: boolean = false;
  noReminderTypeVisibility: boolean = false;

  constructor(private mc: ModalController, private cs: CardsService, private ts: TagsService,
              private cardStatusService: CardStatusService, private translate: TranslateService,
              private recurringRemindersService: RecurringReminders,
              private reminderTypeService: ReminderType) {

    //DEFINIT UNE DATE MINIMUM DANS LE FORMULAIRE
    this.minDeadline = this.cs.toLocalISOString(new Date(), true);
  }

  async ngOnInit() {
    //OBTENIR UNE NOUVELLE INSTANCE CORRECTE
    this.cardEdited = structuredClone(this.card);

    // GET TAGS
    this.tags = await this.ts.getTags();

    // On vérifie la visibilité des elements
    this.checkElementsVisibility();
  }

  async valid(form: NgForm) {
    if (form.valid) {
      if (!this.isEditable) {
        await this.cs.addCard(this.cardEdited);
      } else {
        await this.cs.updateCard(this.cardEdited);
        this.isEditable = false;
      }
      await this.mc.dismiss();
    }
  }

  // Fonction pour vérifier la visibilité de la date d'échéance, (si on l'affiche ou non)
  checkVisibilityDeadline(): boolean {
    return this.noDeadLineVisibility = !(this.isEditable
      && this.cardEdited.status !== Cardstatus.Late || !this.isEditable);
  }

  checkReminderTypeVisibility(): boolean {
    return this.noReminderTypeVisibility = !(this.isEditable
    && this.cardEdited.status !== Cardstatus.Late && this.cardEdited.status !== Cardstatus.Done
      || !this.isEditable);
  }

  checkElementsVisibility() {
    this.checkVisibilityDeadline();
    this.checkReminderTypeVisibility();
  }

  onChangeStatus(event: any) {
    this.cardEdited.status = event.target.value;
    this.checkElementsVisibility();
  }

  onReminderTypeChanged(event: any) {
    const value = event.target.value;
    this.cardEdited.reminder.type = value;

    const reminder = this.cardEdited.reminder;

    if(value !== ReminderTypeEnum.CustomReminder &&
      reminder.customReminders?.reminders.length){
      reminder.customReminders.reminders = [];
      console.log("Custom Reminders clear");
    }
    reminder.smartReminders = (value === ReminderTypeEnum.SmartReminder);
  }

  onCustomRemindersChanged(values:number[]){
    console.log("Card editée: ",this.cardEdited.reminder);
    if(this.cardEdited.reminder.customReminders?.reminders){this.cardEdited.reminder.customReminders.reminders = values;}
  }

  onRecurringRemindersChanged(event: any) {
    this.cardEdited.reminder.recurringReminders = event.target.value;
  }

  onDateTimeChanged(event: any) {
    this.cardEdited.deadline = event.detail.value;
  }

  isMatchedManualRemindersAndDeadline(selectedRecurringReminders: RecurringRemindersEnum): boolean {
    return this.recurringRemindersService.checkRecurringReminders(selectedRecurringReminders, this.cardEdited.deadline);
  }

  getRecurringReminders(key: RecurringRemindersEnum): string {
    return this.recurringRemindersService.getRecurringReminders(key);
  }

  getRecurringRemindersValues() {
    return Object.values(RecurringRemindersEnum);
  }

  getReminderTypeValues() {
    return Object.values(ReminderTypeEnum);
  }

  getReminderType(type: ReminderTypeEnum): string {
    return this.reminderTypeService.getReminderTypeValue(type);
  }

  async closePopUp() {
    await this.mc.dismiss(null, 'cancel');
  }

  get getCurrentLang(): string {
    return this.translate.getCurrentLang();
  }

  getStatus(key: Cardstatus): string {
    return this.cardStatusService.getStatus(key);
  }

  protected readonly ReminderTypeEnum = ReminderTypeEnum;
  protected readonly Date = Date;
}
