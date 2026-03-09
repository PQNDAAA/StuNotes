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
import {Settings} from "../../settings/settings-service/settings";
import {Manualreminders} from "../cards-enum/manualreminders";
import {CardManualreminders} from "../cards-service/card-manualreminders";

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss'],
  standalone: false,
})
export class AddnoteComponent implements OnInit {

  //INPUT SOURCE
  @Input() card: Card = {
    manualReminders: Manualreminders.Never, taskId: [], deadline: this.cs.toLocalISOString(new Date()), important: false,
    status: Cardstatus.Open, createdAt: new Date(), description: "", name: "", tag: ""
  }
  @Input() isEditable: boolean = false;

  //DATA SOURCE
  cardEdited!: Card;
  tags!: Tags[];
  statusValues = Object.values(Cardstatus);
  manualReminders = Object.values(Manualreminders);

  //UI
  minDeadline: string;

  //BOOLEAN
  noDeadLineVisibility: boolean = false;

  constructor(private mc: ModalController, private cs: CardsService, private ts: TagsService,
              private cardStatusService: CardStatusService, private translate: TranslateService,
              private settingsService: Settings, private manualRemindersService: CardManualreminders) {

    //DEFINIT UNE DATE MINIMUM DANS LE FORMULAIRE
    this.minDeadline = this.cs.toLocalISOString(new Date());
  }

  async ngOnInit() {
    //OBTENIR UNE NOUVELLE INSTANCE CORRECTE
    this.cardEdited = structuredClone(this.card);

    // GET TAGS
    this.tags = await this.ts.getTags();

    // On vérifie la visibilité de la date d'échéance, (si on l'affiche ou non)
    this.checkVisibilityDeadline();
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
      && this.cardEdited.status !== Cardstatus.Done
      && this.cardEdited.status !== Cardstatus.Late || !this.isEditable);
  }

  onChangeStatus(event: any) {
    const value = event.target.value;
    this.cardEdited.status = value;
    if (value !== Cardstatus.Late && this.cardEdited.status === Cardstatus.Late) {
      this.noDeadLineVisibility = false
    }
  }

  onManualRemindersChanged(event:any){
    this.cardEdited.manualReminders = event.target.value;
  }

  onDateTimeChanged(event:any){
    this.cardEdited.deadline = event.detail.value;
  }

  isMatchedManualRemindersAndDeadline(selectedManualReminders: Manualreminders): boolean{
  return this.manualRemindersService.checkManualReminders(selectedManualReminders, this.cardEdited.deadline);
  }

  get getManualRemindersBoolean(): boolean{
    return this.settingsService.getSettings().manualReminders;
  }

  getManuelReminders(key: Manualreminders): string{
    return this.manualRemindersService.getManualReminders(key);
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
}
