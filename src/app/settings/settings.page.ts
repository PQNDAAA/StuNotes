import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {

  isCondensate = false;

  constructor(private mc: ModalController) { }

  ngOnInit() {
  }

  async cancelModal(){
    await this.mc.dismiss();
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
