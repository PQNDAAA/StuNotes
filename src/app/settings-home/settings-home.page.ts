import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.page.html',
  styleUrls: ['./settings-home.page.scss'],
  standalone: false,
})
export class SettingsHomePage implements OnInit {

  constructor(private mc : ModalController) { }

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

}
