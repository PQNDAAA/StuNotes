import { Component, OnInit } from '@angular/core';
import {TagsService} from "../../tags/tags-service/tags-service";

@Component({
  selector: 'app-settings-data-tags',
  templateUrl: './settings-data-tags.page.html',
  styleUrls: ['./settings-data-tags.page.scss'],
  standalone: false,
})
export class SettingsDataTagsPage implements OnInit {

  hasTags: boolean | undefined;

  constructor(private ts: TagsService) {
    console.log(this.hasTags);
  }

  ngOnInit() {
  }

  async deleteAllTags(){
    this.hasTags = await this.ts.deleteAllTags();
  }

}
