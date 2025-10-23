import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../cards/addnote/addnote.component";
import { CardsService } from "../cards/cards-service/cards-service";
import {map, Observable} from "rxjs";
import {Card} from "../cards/cards-interface/card";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {

  cards$: Observable<Card[]>;

  results: Observable<Card[]>;

  constructor(private mc : ModalController, private cs : CardsService) {
    this.cards$ = this.cs.cards$;
    this.results = this.cards$;
  }

  async openPopup(){
    const modal = await this.mc.create({
      component : AddnoteComponent,
    });
    await modal.present();
  }

  eventInput(event: Event){
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.results = this.cards$.pipe(
      map(cards => cards.filter(c => c.name.toLowerCase().includes(query))));
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
   // this.cards = this.cs.getCards();
  }

}
