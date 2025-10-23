import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {Tags} from "../tags";
import {TagsService} from "../tags-service/tags-service";

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

  async deleteTagCard(){
    const id = this.tag.id;

    if(id !== undefined){
      await this.ts.deleteTag(id);
    } else {
      console.log("ID undefined");
    }
  }

}
