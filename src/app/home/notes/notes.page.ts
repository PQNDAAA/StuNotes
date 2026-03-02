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
import {FilterDateEnum} from "../filter/enum/filter-date-enum";
import {TranslateService} from "@ngx-translate/core";
import {DatepickerValue} from "ngxsmk-datepicker";

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
  private subjectsFilter$ = new BehaviorSubject<Map<string, boolean>>(new Map());
  private dateFilter$ = new BehaviorSubject<FilterDateEnum | null>(null);

  //Output view
  results$: Observable<Card[]>;
  cardsByFilters$: Observable<Card[]>;
  hasResultData = true;

  defaultStatus = Cardstatus.InProgress;

  allFilterDate = Object.values(FilterDateEnum).filter(date =>
    date !== FilterDateEnum.CustomDate);

  query = '';

  filter: FilterInterface = {
    important: false,
    tags: new Map<string, boolean>(),
    date: null,
    customDate: {
      start: null,
      end: null
    }
  };

  constructor(private mc: ModalController, private cs: CardsService,
              private subjectsService: TagsService, private translate: TranslateService) {
    this.cards$ = this.cs.cards$;
    this.subjects$ = this.subjectsService.tags$;

    this.cardsByFilters$ = combineLatest([
      this.cards$,
      this.dateFilter$,
      this.subjectsFilter$,
      this.searchFilter$,
      this.importantFilter$
    ]).pipe(
      map(([cards, date, subjects, query, important]) => {

        return cards.filter(card => {

          const matchDate = date !== null
            ? this.calculateFilterDate(card.deadline)
            : true;


          const matchSubjects = subjects.size > 0
            ? subjects.has(card.tag.trim())
            : true;

          const matchSearch = query
            ? card.name.toLowerCase().includes(query)
            : true;

          const matchImportant = important
            ? card.important === true
            : true;

          return matchSearch && matchSubjects && matchDate && matchImportant;
        });
      }),
      tap(cardsFilter => this.cs.refreshCountCards(cardsFilter)),
      tap(cardsFilter => console.log("Cartes Filtrées: ", cardsFilter))
    );

    this.results$ = combineLatest([
      this.statusFilter$,
      this.cardsByFilters$
    ]).pipe(
      map(([status, cardsFilter]) => {
        return cardsFilter.filter(card => {
          return card.status.trim() === status;
        });
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

  async openPopup() {
    const modal = await this.mc.create({
      component: AddnoteComponent,
    });
    await modal.present();
  }

  eventInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    this.query = target.value?.toLowerCase() || '';

    this.searchFilter$.next(this.query);
  }

  doRefresh(event: any) {
    setTimeout(async () => {
      await this.cs.updateOverdueTasks();

      event.target.complete();
    })
  }

  onFilterImportantChanged() {
    this.importantFilter$.next(this.filter.important);
  }

  onFilterSubjectsChanged(tagSelected: string, event: any) {
    if (!event.detail.checked && this.filter.tags.has(tagSelected)) {
      this.filter.tags.delete(tagSelected);
    } else {
      this.filter.tags.set(tagSelected, true);
    }
    console.log(this.filter.tags);
    this.subjectsFilter$.next(this.filter.tags);
  }

  onFilterDateChanged() {
    this.dateFilter$.next(this.filter.date);
  }

  onCustomDateChanged(event: DatepickerValue) {
    if (!event) {
      this.filter.date = null;
      return;
    }

    if ('start' in event && 'end' in event) {
      this.filter.customDate = event;
      console.log(this.filter.customDate);
    }
  }

  calculateFilterDate(deadline: string): boolean {
    const deadlineMs = new Date(deadline).getTime(); // Deadline en ms
    const now = new Date(); //Date maintenant

    switch (this.filter.date) {
      case FilterDateEnum.Today:
        // de 00h à 23h59
        const minTodayMs = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const maxTodayMs = new Date(now.setHours(23, 59, 59, 59)).getTime();

        return deadlineMs >= minTodayMs && deadlineMs <= maxTodayMs;
      case FilterDateEnum.Soon:
        const threeDaysMs = 72 * 60 * 60 * 1000;

        return deadlineMs >= Date.now() && deadlineMs <= Date.now() + threeDaysMs;
      case FilterDateEnum.Week:

        const firstDay = new Date(now.setDate(now.getDate() - (now.getDay() + 6) % 7));
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(now.setDate(firstDay.getDate() + 6));
        lastDay.setHours(23, 59, 59, 59);

        return deadlineMs >= firstDay.getTime() && deadlineMs <= lastDay.getTime();
      case FilterDateEnum.Month:

        const firstDayMonth = new Date(now.setDate(1));
        firstDayMonth.setHours(0, 0, 0, 0);

        const lastDayMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDayMonth.setHours(23, 59, 59, 59);


        console.log(firstDayMonth, lastDayMonth);

        return deadlineMs >= firstDayMonth.getTime() && deadlineMs <= lastDayMonth.getTime();
      default:
        return false;
    }
  }

  //METTRE DANS FILTER SERVICE PROCHAINEMENT
  getTagValue(tag: string): boolean {
    return this.filter.tags.get(tag) ?? false;
  }

  get getCurrentLang(): string {
    return this.translate.getCurrentLang();
  }

  getDateValueString(value: string) {
    return this.translate.instant(`FILTER.${value}`);
  }

  onFilterChanged(status: Cardstatus) {
    this.statusFilter$.next(status);
  }

  protected readonly FilterDateEnum = FilterDateEnum;
}
