import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../cards/addnote/addnote.component";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private mc : ModalController) {}

  async openPopup(){
    const modal = await this.mc.create({
      component: AddnoteComponent
    });

    await modal.present();
  }


}

