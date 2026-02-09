import {Component, Input, OnInit} from '@angular/core';
import {IonicModule, ModalController} from "@ionic/angular";
import {TagsService} from "../tags-service/tags-service";
import {Tags} from "../tags";
import {FormsModule, NgForm} from "@angular/forms";
import {TranslatePipe} from "@ngx-translate/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-addtag',
  templateUrl: './addtag.component.html',
  styleUrls: ['./addtag.component.scss'],
  imports: [
    IonicModule,
    FormsModule,
    TranslatePipe,
  ]
})
export class AddtagComponent  implements OnInit {

  @Input() tag: Tags = {name : ""};

  @Input() editMode = false;

  constructor(private mc : ModalController, private ts : TagsService) { }

  ngOnInit() {}

  async closePopUp() {
    await this.mc.dismiss();
  }

  async valid(form : NgForm) {
    if (form.valid) {
      if (!this.editMode) {
        await this.ts.addTag(this.tag);
      } else {
        await this.ts.updateTag(this.tag)
        this.editMode = false;
      }
      await this.mc.dismiss();
    }
  }
}
