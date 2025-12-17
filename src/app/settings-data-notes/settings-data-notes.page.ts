import { Component, OnInit } from '@angular/core';
import {CardsService} from "../cards/cards-service/cards-service";

@Component({
  selector: 'app-settings-data-notes',
  templateUrl: './settings-data-notes.page.html',
  styleUrls: ['./settings-data-notes.page.scss'],
  standalone: false,
})
export class SettingsDataNotesPage implements OnInit {

  constructor(private cs: CardsService) { }

  ngOnInit() {
  }


  async deleteAllCards(){
    await this.cs.deleteAllCards();
  }

}
