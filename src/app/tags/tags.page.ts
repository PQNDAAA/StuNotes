import { Component, OnInit } from '@angular/core';

import { ModalController } from "@ionic/angular";
import {AddtagComponent} from "./addtag/addtag.component";
import {Tags} from "./tags";
import {TagsService} from "./tags-service/tags-service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tags',
  templateUrl: './tags.page.html',
  styleUrls: ['./tags.page.scss'],
  standalone: false,
})
export class TagsPage implements OnInit {

  tags$: Observable<Tags[]>;

  hasEmptyTags = false;

  constructor(private mc : ModalController, private ts: TagsService) {
    this.tags$ = this.ts.tags$;
  }

  ngOnInit() {
    this.tags$.subscribe(data => {
      this.hasEmptyTags = (!data || data.length === 0);
    })
  }

  async openPopup(){
    const modal = await this.mc.create({
      component: AddtagComponent,
    });
    await modal.present();
  }

}
