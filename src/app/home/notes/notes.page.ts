import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {AddnoteComponent} from "../../cards/addnote/addnote.component";
import {CardsService} from "../../cards/cards-service/cards-service";
import {BehaviorSubject, combineLatest, map, Observable, tap} from "rxjs";
import {Card} from "../../cards/cards-interface/card";
import {Cardstatus} from "../../cards/cards-enum/cardstatus";
import {FilterInterface} from "../filter/interface/filter-interface";
import {TagsService} from "../../tags/tags-service/tags-service";
import {Tags} from "../../tags/tags-interface/tags";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {

  //Data source
  cards$: Observable<Card[]>;
  subjects$: Observable<Tags[]>;

  //Filters streams
  private statusFilter$ = new BehaviorSubject<Cardstatus>(Cardstatus.InProgress);
  private searchFilter$ = new BehaviorSubject<string>('');
  private importantFilter$ = new BehaviorSubject<boolean>(false);
  private subjectsFilter$ = new BehaviorSubject<Map<string,boolean>>(new Map());



  countCards = new Map<Cardstatus, number>(); // OK

  //Output view
  results$: Observable<Card[]>;
  cardsByFilters$: Observable<Card[]>;
  hasResultData = true;

  defaultStatus = Cardstatus.InProgress;

  query = '';

  filter: FilterInterface = {
    important: false,
    tags: new Map<string, boolean>(),
  };

  constructor(private mc : ModalController, private cs : CardsService,
              private subjectsService: TagsService) {
    this.cards$ = this.cs.cards$;
    this.subjects$ = this.subjectsService.tags$;

    this.cardsByFilters$ = combineLatest([
      this.cards$,
      this.subjectsFilter$,
      this.searchFilter$,
      this.importantFilter$
    ]).pipe(
      map(([cards, subjects, query, important]) => {

        return cards.filter(card => {

          const matchSubjects = subjects.size > 0
            ? subjects.has(card.tag.trim())
            : true;

          const matchSearch = query
            ? card.name.toLowerCase().includes(query)
            : true;

          const matchImportant = important
            ? card.important === true
            : true;

          return matchSearch && matchSubjects && matchImportant;
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

  onFilterSubjectsChanged(tagSelected: string, event: any){
    if(!event.detail.checked && this.filter.tags.has(tagSelected)){
      this.filter.tags.delete(tagSelected);
    } else {
      this.filter.tags.set(tagSelected, true);
    }
    console.log(this.filter.tags);
    this.subjectsFilter$.next(this.filter.tags);
  }

  getTagValue(tag: string) : boolean{
    return this.filter.tags.get(tag) ?? false;
  }

  onFilterChanged(status: Cardstatus){
    this.statusFilter$.next(status);
  }
}
