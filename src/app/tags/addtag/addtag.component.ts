import { Component, OnInit } from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {TagsService} from "../tags-service/tags-service";
import {Tags} from "../tags";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-addtag',
  templateUrl: './addtag.component.html',
  styleUrls: ['./addtag.component.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class AddtagComponent  implements OnInit {

  tag: Tags = {name : ""};

  constructor(private mc : ModalController, private ts : TagsService) { }

  ngOnInit() {}

  async closePopUp() {
    await this.mc.dismiss();
  }

  async valid() {
    await this.ts.addTag(this.tag);
    await this.mc.dismiss();
  }
}
