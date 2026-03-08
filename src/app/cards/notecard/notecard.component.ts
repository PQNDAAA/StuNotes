import {Component, Input, OnInit} from '@angular/core';
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {AlertController, ModalController} from "@ionic/angular";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardStatusService} from "../cards-service/card-status-service";
import {TranslateService} from "@ngx-translate/core";
import {AddnoteComponent} from "../addnote/addnote.component";

@Component({
  selector: 'app-notecard',
  templateUrl: './notecard.component.html',
  styleUrls: ['./notecard.component.scss'],
  standalone: false
})
export class NotecardComponent implements OnInit {


  @Input() card!:Card;

  dateCard!: string;

  deadLine!: Date;
  deadLineStr!: string;

  public alertButtons = [
    {
      text:"Cancel",
      role:"cancel",
      handler:() => {
      }
    },
    {
      text:"OK",
      role:"confirm",
      handler:async () => {
        await this.deleteCard();
      }
    }
  ]

  constructor(private cs: CardsService, private ac: AlertController, private cardStatusService: CardStatusService,
              private translate : TranslateService,private mc: ModalController) {}

  async onSwipe(){
    await this.presentAlert();
  }

  async presentAlert(){
    const alert = await this.ac.create({
      header: this.translate.instant('TASKS.DeleteTask'),
      buttons: [
        {text:this.translate.instant('GENERAL.CancelButton'),
          role:"cancel"},
        {
          text:"OK",
          role:"confirm",
          handler:async () => {
            await this.deleteCard();
            await alert.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCard(){
    await this.cs.deleteCard(this.card);
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

  getStatusColor(status: string): string{return this.cs.getStatusColor(status);}

  getStatus(key: Cardstatus){return this.cardStatusService.getStatus(key);}

  ngOnInit() {
    // CREATEAT DATE FORMAT
   this.dateCard = this.card.createdAt.toLocaleString(this.translate.getCurrentLang(),
     {
      year: "numeric",
      month:"long",
      day:"numeric",
     hour: "numeric",
     minute:"2-digit"
    });

   // DEADLINE FORMAT
   this.deadLine = new Date(this.card.deadline);
   this.deadLineStr = this.deadLine.toLocaleString(this.translate.getCurrentLang(), {
     year: "numeric",
     month:"long",
     day:"numeric",
     hour: "numeric",
     minute:"2-digit"
   });
  }

}
