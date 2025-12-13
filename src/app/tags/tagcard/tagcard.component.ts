import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Tags} from "../tags";
import {TagsService} from "../tags-service/tags-service";
import {Haptics, ImpactStyle} from "@capacitor/haptics";

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

  constructor(private ts: TagsService) { }

  ngOnInit() {}

  async onSwipe(){
    await this.deleteTagCard();
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

}
