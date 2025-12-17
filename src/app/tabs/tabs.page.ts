import { Component } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../cards/addnote/addnote.component";
import {Router} from "@angular/router";
import {AddtagComponent} from "../tags/addtag/addtag.component";
import {SettingsPageModule} from "../settings/settings.module";
import {SettingsPage} from "../settings/settings.page";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private mc : ModalController, private router : Router) {}

  async openPopup() {
    const currentUrl = this.router.url;
    let componentToLoad;

    if (currentUrl.includes('/tabs/notes')) {
      componentToLoad = AddnoteComponent;
    } else if (currentUrl.includes('tabs/tags')) {
      componentToLoad = AddtagComponent
    }

    if (componentToLoad) {
      const modal = await this.mc.create({
        component: componentToLoad
      });

      await modal.present();
    } else {
      console.log("Error.");
    }
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

