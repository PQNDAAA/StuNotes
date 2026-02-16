import {Component, Input, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {Tags} from "../../tags/tags";
import {TagsService} from "../../tags/tags-service/tags-service";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardStatusService} from "../cards-service/card-status-service";
import {TranslateService} from "@ngx-translate/core";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss'],
  standalone: false,
})
export class AddnoteComponent implements OnInit {

  @Input() card: Card = {
    taskId: [], deadline: this.cs.toLocalISOString(new Date()), important: false,
    status: Cardstatus.Open, createdAt: new Date(), description: "", name: "", tag: ""
  }

  @Input() isEditable: boolean = false;
  tags!: Tags[];
  statusValues = Object.values(Cardstatus);
  currentStatus: Cardstatus = Cardstatus.Open;

  minDeadline: string;
  noDeadLineVisibility: boolean = false;

  constructor(private mc: ModalController, private cs: CardsService, private ts: TagsService,
              private cardStatusService: CardStatusService, private translate: TranslateService) {
    this.getTags();

    //DEFINIT UNE DATE MINIMUM DANS LE FORMULAIRE
    this.minDeadline = this.cs.toLocalISOString(new Date());
  }

  ngOnInit() {
    this.currentStatus = this.card.status;

    // On filtre les statuts
    this.statusValues = this.statusValues.filter(value => value !== Cardstatus.Late);

    // On vérifie la visibilité de la date d'échéance, (si on l'affiche ou non)
    this.checkVisibilityDeadline();
  }

  async valid(form: NgForm) {
    if (form.valid) {
      if (!this.isEditable) {
        await this.cs.addCard(this.card);
      } else {
        await this.cs.updateCard(this.card);
        this.isEditable = false;
      }
      await this.mc.dismiss();
    }
  }

  checkVisibilityDeadline(): boolean {
    return this.noDeadLineVisibility = !(this.isEditable
      && this.currentStatus !== Cardstatus.Done
      && this.currentStatus !== Cardstatus.Late || !this.isEditable);
  }

  onChangeStatus(event: any) {
    const value = event.target.value;
    if (value !== Cardstatus.Late && this.currentStatus === Cardstatus.Late) {
      this.noDeadLineVisibility = false
    }
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

  async getTags() {
    this.tags = await this.ts.getTags();
  }
}
