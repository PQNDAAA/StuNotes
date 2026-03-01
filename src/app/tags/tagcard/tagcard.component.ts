import {Component, Input, OnInit} from '@angular/core';
import {AlertController, IonicModule, ModalController} from "@ionic/angular";
import {Tags} from "../tags-interface/tags";
import {TagsService} from "../tags-service/tags-service";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {async} from "rxjs";
import {AddtagComponent} from "../addtag/addtag.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-tagcard',
  templateUrl: './tagcard.component.html',
  styleUrls: ['./tagcard.component.scss'],
  imports: [
    IonicModule,
    TranslatePipe
  ]
})
export class TagcardComponent  implements OnInit {

  @Input() tag!: Tags;

  constructor(private ts: TagsService,private mc : ModalController, private ac : AlertController,
  private translate: TranslateService) { }

  ngOnInit() {}

  async onSwipe(){
    await this.presentAlert();
  }

  async deleteTagCard(){
    const id = this.tag.id;

    if(id !== undefined){
      await this.ts.deleteTag(id);
    } else {
      console.log("ID undefined");
    }
  }

  async openEditMode(){
    return await this.ts.openEditMode(this.tag);
  }

  async presentAlert(){
    const alert = await this.ac.create({
      header:this.translate.instant('SUBJECTS.DeleteSubject'),
      buttons: [
        {
          text: this.translate.instant('GENERAL.CancelButton'),
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
