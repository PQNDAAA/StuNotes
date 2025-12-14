import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {SettingsDltallnotesPageModule} from "../settings-dltallnotes/settings-dltallnotes.module";
import {SettingsDltallnotesPage} from "../settings-dltallnotes/settings-dltallnotes.page";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  constructor(private mc : ModalController) { }

  ngOnInit() {
  }

  async openModal(){
    await this.mc.dismiss();

    const modal = await this.mc.create({
      component: SettingsDltallnotesPage,
      breakpoints: [0, 0.93, 1],
      initialBreakpoint: 0.93
    });

    await modal.present();
  }

}
