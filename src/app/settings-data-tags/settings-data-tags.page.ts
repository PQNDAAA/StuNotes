import { Component, OnInit } from '@angular/core';
import {TagsService} from "../tags/tags-service/tags-service";

@Component({
  selector: 'app-settings-data-tags',
  templateUrl: './settings-data-tags.page.html',
  styleUrls: ['./settings-data-tags.page.scss'],
  standalone: false,
})
export class SettingsDataTagsPage implements OnInit {

  constructor(private ts: TagsService) { }

  ngOnInit() {
  }

  async deleteAllTags(){
    await this.ts.deleteAllTags();
  }

}
