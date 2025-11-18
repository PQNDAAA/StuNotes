import {Component, Input, OnInit} from '@angular/core';
import {CardsService} from "../cards-service/cards-service";
import {Card} from "../cards-interface/card";
import {CardstatusColors} from "../cardstatus-colors";
import {Cardstatus} from "../cardstatus";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-notecard',
  templateUrl: './notecard.component.html',
  styleUrls: ['./notecard.component.scss'],
  standalone: false
})
export class NotecardComponent implements OnInit {


  @Input() card!:Card;

  dateCard!: string;

  statusColors = CardstatusColors;

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

  constructor(private cs: CardsService, private ac: AlertController) {
  }

  async presentAlert(){
    const alert = await this.ac.create({
      header: 'Are you sure to delete this note ?',
      buttons: [
        {text:"Cancel",
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
    const id = this.card.id;

    if(id !== undefined) {
      await this.cs.deleteCard(id);
    } else {
      console.log("ID undefined");
    }
  }

  async openPopup(){
    return await this.cs.openPopupEditCard(this.card);
  }

  getStatusColor(status: string): string{
    const normalized = status.trim() as Cardstatus;
    return this.statusColors[normalized];
  }


  ngOnInit() {
   this.dateCard = this.card.createdAt.toLocaleString("fr-FR",{
      year: "numeric",
      month:"long",
      day:"numeric",
     hour: "numeric",
     minute:"2-digit"
    });
  }

}
