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
import {DatepickerValue} from "ngxsmk-datepicker";
import {FilterService} from "../filter/service/filter-service";
import {FilterDB} from "../filter/service/filter-db";

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
  filter$: Observable<FilterInterface>;

  //Filters streams
  private statusFilter$ = new BehaviorSubject<Cardstatus>(Cardstatus.InProgress);
  private searchFilter$ = new BehaviorSubject<string>('');

  //Output view
  results$: Observable<Card[]>;
  cardsByFilters$: Observable<Card[]>;
  hasResultData = true;

  defaultStatus = Cardstatus.InProgress;

  allFilterDate = Object.values(FilterDateEnum).filter(date =>
    date !== FilterDateEnum.CustomDate);

  query = '';

  filter!: FilterInterface;

  constructor(private mc: ModalController, private cs: CardsService,
              private subjectsService: TagsService, private filterService: FilterService) {
    this.cards$ = this.cs.cards$;
    this.subjects$ = this.subjectsService.tags$;
    this.filter$ = this.filterService.filters$;

    this.cardsByFilters$ = combineLatest([
      this.cards$,
      this.filter$,
      this.searchFilter$,
    ]).pipe(
      map(([cards, filters, query]) => {

        return cards.filter(card => {

          const matchDate = filters.date !== null
            ? this.calculateFilterDate(card.deadline)
            : true;

          const matchSubjects = filters.tags.size > 0
            ? filters.tags.has(card.tag.trim())
            : true;

          const matchSearch = query
            ? card.name.toLowerCase().includes(query)
            : true;

          const matchImportant = filters.important
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
    this.filter$.subscribe(filters => {
      this.filter = filters;
    });
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

  //OK
  async onFilterImportantChanged(event : any) {
    //On get la valeur boolean de la checkbox
    const value = event.detail.checked;
    //On crée une instance mis a jour avec l'interface et une valeur qui change
    const updatedImportantFilter = {...this.filter, important: value}

    await this.filterService.changeFiltersValue(updatedImportantFilter);
  }

  //OK
  async onFilterSubjectsChanged(tagSelected: string, event: any) {
    //new Map va créer une nouvelle instance
    const filterSubjectsCache = new Map(this.filter.tags);

    if (!event.detail.checked && this.filter.tags.has(tagSelected)) {
     filterSubjectsCache.delete(tagSelected);
    } else {
      filterSubjectsCache.set(tagSelected, true);
    }

    const updatedSubjectsFilter = {...this.filter, tags: filterSubjectsCache}
    await this.filterService.changeFiltersValue(updatedSubjectsFilter);
  }

  //OK
  async onFilterDateChanged(event: any) {
    const value = event.detail.value;
    const updatedDateFilter = {...this.filter, date: value}

    await this.filterService.changeFiltersValue(updatedDateFilter);
  }

  //OK
  async onCustomDateChanged(event: DatepickerValue) {
    if (!event) {
      const updatedDateFilter = {...this.filter, date: null, customDate: null}
      await this.filterService.changeFiltersValue(updatedDateFilter);
      return;
    }

    if ('start' in event && 'end' in event) {
      const updatedCustomDateFilter = {...this.filter, customDate: event}
      await this.filterService.changeFiltersValue(updatedCustomDateFilter);
      console.log(updatedCustomDateFilter.customDate);
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
      case FilterDateEnum.CustomDate:

          const startDate = this.filter.customDate?.start
            ? new Date(this.filter.customDate.start).getTime()
          : null;
          const endDate = this.filter.customDate?.end
            ? new Date(this.filter.customDate.end).getTime()
            : null;

        return startDate !== null && endDate !== null
          ? deadlineMs >= startDate && deadlineMs <= endDate
          : false;
      default:
        return true;
    }
  }

  onFilterChanged(status: Cardstatus) {this.statusFilter$.next(status);}

  isTagChecked(tag: string) {return this.filter.tags.get(tag) ?? false;}

  get getCurrentLang(): string {return this.filterService.getCurrentLang;}

  getDateStringValue(value: string) {return this.filterService.getDateStringValue(value);}

  protected readonly FilterDateEnum = FilterDateEnum;
}
