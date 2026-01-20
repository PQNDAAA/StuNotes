import {Component, Input} from '@angular/core';

import {ModalController} from "@ionic/angular";
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {Tags} from "../../tags/tags";
import {TagsService} from "../../tags/tags-service/tags-service";
import {Cardstatus} from "../cardstatus";
import {LocalNotificationService} from "../../local-notification-service";

@Component({
  selector: 'app-addnote',
  templateUrl: './addnote.component.html',
  styleUrls: ['./addnote.component.scss'],
  standalone: false,
})
export class AddnoteComponent {

  @Input() card: Card = {taskId: [], deadline: new Date().toISOString(), important: false,
    status: Cardstatus.ToDo, createdAt: new Date(), description: "", name: "", tag: ""}

  @Input() isEditable: boolean = false;

  //@Input() cardEdited: Card = {status: Cardstatus.InProcress, createdAt: new Date(), description: "", name: "", tag: ""};

  tags!: Tags[];

  statusValues = Object.values(Cardstatus);

  constructor(private mc : ModalController, private cs : CardsService, private ts:TagsService) {
    this.getTags();
  }

  async getTags(){
    this.tags = await this.ts.getTags();
  }

  async closePopUp(){
    await this.mc.dismiss(null,'cancel');
    console.log(this.card);
  }

  async valid(){
    if(!this.isEditable) {
      await this.cs.addCard(this.card);
      console.log(this.card.name);
    } else {
      await this.cs.updateCard(this.card);
      this.isEditable = false;
    }
    console.log(this.card.deadline);
    await this.mc.dismiss();
  }
}
