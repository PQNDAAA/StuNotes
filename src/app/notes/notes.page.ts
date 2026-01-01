import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../cards/addnote/addnote.component";
import { CardsService } from "../cards/cards-service/cards-service";
import {map, Observable} from "rxjs";
import {Card} from "../cards/cards-interface/card";
import {Cardstatus} from "../cards/cardstatus";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {

  cards$: Observable<Card[]>;

  results: Observable<Card[]>;

  currentStatus!: Cardstatus;

  hasResultData = true;

  query!: string;

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
    this.query = target.value?.toLowerCase() || '';

    if(this.query) {
      this.results = this.cards$.pipe(
        map(cards => cards.filter(c => c.name.toLowerCase().includes(this.query))));
    }
  }

  onFilterChanged(status: Cardstatus){
    this.currentStatus = status;
    this.results = this.cards$.pipe(map(cards => cards.filter(c => c.status.trim() === status)));

    this.results.subscribe(data => {
      this.hasResultData = !(!data || data.length === 0);
    })
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
   // this.cards = this.cs.getCards();
  }

}
