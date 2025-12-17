import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {CardsService} from "../cards/cards-service/cards-service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})


export class SettingsPage implements OnInit {

  constructor(private mc: ModalController) { }

  ngOnInit() {
  }

  async cancelModal(){
    await this.mc.dismiss();
  }

}
