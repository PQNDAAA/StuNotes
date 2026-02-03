import {Component, Input, OnInit} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {Tags} from "../../tags/tags";
import {TagsService} from "../../tags/tags-service/tags-service";
import {Cardstatus} from "../cardstatus";
import {CardStatusService} from "../../card-status-service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss'],
  standalone: false,
})
export class AddnoteComponent implements OnInit{

  @Input() card: Card = {
    taskId: [], deadline: this.cs.toLocalISOString(new Date()), important: false,
    status: Cardstatus.Open, createdAt: new Date(), description: "", name: "", tag: ""
  }

  @Input() isEditable: boolean = false;
  tags!: Tags[];
  statusValues = Object.values(Cardstatus);
  currentStatus : Cardstatus = Cardstatus.Open;
  minDeadline : string;

  constructor(private mc: ModalController, private cs: CardsService, private ts: TagsService,
              private cardStatusService: CardStatusService, private translate: TranslateService) {
    this.getTags();

    //DEFINIT UNE DATE MINIMUM DANS LE FORMULAIRE
    this.minDeadline = this.cs.toLocalISOString(new Date());
  }

  ngOnInit(){
    this.currentStatus = this.card.status;

    this.statusValues = this.statusValues.filter(value => value !== Cardstatus.Late);
  }

  getStatus(key: Cardstatus){
    return this.cardStatusService.getStatus(key);
  }
  get getCurrentLang() : string{
    return this.translate.getCurrentLang();
  }

  async getTags() {
    this.tags = await this.ts.getTags();
  }

  async closePopUp() {
    await this.mc.dismiss(null, 'cancel');
    console.log(this.card);
  }

  async valid() {
    if (!this.isEditable) {
      console.log(this.card.status);
      await this.cs.addCard(this.card);
      console.log(this.card);
    } else {
      await this.cs.updateCard(this.card);
      this.isEditable = false;
    }
    console.log(this.card.deadline);
    await this.mc.dismiss();
  }

  protected readonly Cardstatus = Cardstatus;
}
