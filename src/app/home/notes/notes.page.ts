import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../../cards/addnote/addnote.component";
import {CardsService} from "../../cards/cards-service/cards-service";
import {BehaviorSubject, combineLatest, map, Observable, tap} from "rxjs";
import {Card} from "../../cards/cards-interface/card";
import {Cardstatus} from "../../cards/cards-enum/cardstatus";
import {FilterInterface} from "../filter/interface/filter-interface";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {

  //Data source
  cards$: Observable<Card[]>;

  //Filters streams
  private statusFilter$ = new BehaviorSubject<Cardstatus>(Cardstatus.InProgress);
  private searchFilter$ = new BehaviorSubject<string>('');
  private importantFilter$ = new BehaviorSubject<boolean>(false);



  countCards = new Map<Cardstatus, number>(); // OK

  //Output view
  results$: Observable<Card[]>;
  cardsByFilters$: Observable<Card[]>;
  hasResultData = true;

  defaultStatus = Cardstatus.InProgress;

  query = '';

  filter: FilterInterface = {
    important: false,
  };

  constructor(private mc : ModalController, private cs : CardsService) {
    this.cards$ = this.cs.cards$;

    this.cardsByFilters$ = combineLatest([
      this.cards$,
      this.searchFilter$,
      this.importantFilter$
    ]).pipe(
      map(([cards, query, important]) => {

        return cards.filter(card => {

          const matchSearch = query
            ? card.name.toLowerCase().includes(query)
            : true;

          const matchImportant = important
            ? card.important === true
            : true;

          return matchSearch && matchImportant;
        });
      }),
      tap(cardsFilter => this.cs.refreshCountCards(cardsFilter)),
      tap(cardsFilter => console.log("Cartes Filtrées: ",cardsFilter))
    );

    this.results$ = combineLatest([
      this.statusFilter$,
      this.cardsByFilters$
    ]).pipe(
      map(([status,cardsFilter]) => {
        return cardsFilter.filter(card => {
          return card.status.trim() === status;});
      }),
      tap(cards => this.hasResultData = cards.length > 0)
    );



  }

  ngOnInit() {
    this.statusFilter$.next(this.defaultStatus);


    this.cs.countCards$.subscribe(cards => {
      console.log(cards);
    })

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

    this.searchFilter$.next(this.query);
  }

  doRefresh(event : any){
    setTimeout(async () => {
      await this.cs.updateOverdueTasks();

      event.target.complete();
    })
  }

  onFilterImportantChanged(){
    this.importantFilter$.next(this.filter.important);
  }

  onFilterChanged(status: Cardstatus){
    this.statusFilter$.next(status);
  }
}
