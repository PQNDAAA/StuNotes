import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../cards/addnote/addnote.component";
import {Router} from "@angular/router";
import {AddtagComponent} from "../tags/addtag/addtag.component";
import {SettingsPageModule} from "../settings/settings.module";
import {SettingsPage} from "../settings/settings.page";
import {CardsService} from "../cards/cards-service/cards-service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private mc : ModalController, private router : Router, private cards: CardsService) {}

  async showAllNotes(){
    console.log(await this.cards.getCards());
  }

  hasOpenSettings():boolean{
    return this.router.url.includes('tabs/settings');
  }

  async openSettings(){
    const modal = await this.mc.create({
      component: SettingsPage,
      breakpoints: [0, 0.93, 1],
      initialBreakpoint: 0.93
    })

    await modal.present();
  }
}

