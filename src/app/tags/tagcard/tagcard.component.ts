import {Component, Input, OnInit} from '@angular/core';
import {AlertController, IonicModule} from "@ionic/angular";
import {Tags} from "../tags";
import {TagsService} from "../tags-service/tags-service";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {async} from "rxjs";

@Component({
  selector: 'app-tagcard',
  templateUrl: './tagcard.component.html',
  styleUrls: ['./tagcard.component.scss'],
  imports: [
    IonicModule
  ]
})
export class TagcardComponent  implements OnInit {

  @Input() tag!: Tags;

  constructor(private ts: TagsService, private ac : AlertController) { }

  ngOnInit() {}

  async onSwipe(){
    await this.presentAlert();
  }

  async deleteTagCard(){
    const id = this.tag.id;

    if(id !== undefined){
      await this.ts.deleteTag(id);
      await Haptics.impact({style: ImpactStyle.Medium});
    } else {
      console.log("ID undefined");
    }
  }

  async presentAlert(){
    const alert = await this.ac.create({
      header:'Are you sure to delete this tag ?',
      buttons: [
        {
          text: "Cancel",
          role:"cancel"
        },
        {
          text:"OK",
          role:"confirm",
          handler: async() => {
            await this.deleteTagCard();
            await alert.dismiss();
          }
        }
      ]
    });
    await alert.present();

  }

}
