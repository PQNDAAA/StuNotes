import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterLink} from "@angular/router";
import {Settings} from "../settings";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  isDarkMode = false;

  constructor(private mc : ModalController, private settingsservice: Settings) {
    this.isDarkMode = this.settingsservice.isDarkMode;
  }

  isCondensate = false;

  ngOnInit() {
  }

  async openModal(){
    await this.mc.dismiss();

    const modal = await this.mc.create({
      component: "",
      breakpoints: [0, 0.93, 1],
      initialBreakpoint: 0.93
    });

    await modal.present();
  }

  onScroll(event: any){
    const scrollTop = event.detail.scrollTop;
    console.log("Scroll position ",scrollTop);

    if(scrollTop > 60){
      console.log("Atteint");
      this.isCondensate = true;
    } else {
      this.isCondensate = false;
      console.log("<60");
    }
  }

  onToggleDarkMode(event: any){
    this.isDarkMode = event.detail.checked;
    this.settingsservice.isDarkMode = this.isDarkMode;
    document.body.classList.toggle('dark',this.isDarkMode);
  }

}
