import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {AlertController, IonContent, ModalController} from "@ionic/angular";
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
import {LocalNotificationService} from "../../notifications/service/local-notification-service";
import {TranslateService} from "@ngx-translate/core";
import {App} from "../../app";

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false,
})
export class NotesPage implements OnInit {

  //Data source
  cards$!: Observable<Card[]>;
  subjects$!: Observable<Tags[]>;
  filter$!: Observable<FilterInterface>;

  //Filters streams
  private statusFilter$ = new BehaviorSubject<Cardstatus>(Cardstatus.InProgress);
  private searchFilter$ = new BehaviorSubject<string>('');

  //Output view
  results$!: Observable<Card[]>;
  cardsByFilters$!: Observable<Card[]>;
  hasResultData = true;

  defaultStatus = Cardstatus.InProgress;

  allFilterDate = Object.values(FilterDateEnum).filter(date =>
    date !== FilterDateEnum.CustomDate);

  query = '';

  filter!: FilterInterface;

  @ViewChild(IonContent) content!: IonContent;
  @ViewChildren('parallaxCard') cards! : QueryList<ElementRef>;


  constructor(private mc: ModalController, private cs: CardsService,
              private subjectsService: TagsService, private filterService: FilterService
              ,private translate: TranslateService, private ac: AlertController, private appService: App) {
    if (this.appService.isReady) {
      this.cards$ = this.cs.cards$;
      this.subjects$ = this.subjectsService.tags$;
      this.filter$ = this.filterService.filters$;

      // this.notificationService.notificationActionPerformed$.subscribe(id => {this.openTaskLocalNotificationPopup(id);});

      this.cardsByFilters$ = combineLatest([
        this.cards$,
        this.filter$,
        this.searchFilter$,
      ]).pipe(
        map(([cards, filters, query]) => {

          return cards.filter(card => {

            const matchDate = filters.date !== null
              ? this.handleDateFilter(card.deadline)
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
  }

  ngOnInit() {
    this.statusFilter$.next(this.defaultStatus);
    this.filter$.subscribe(filters => {
      this.filter = filters;
    });
  }

  async openTaskLocalNotificationPopup(id: number) {
    const card = await this.cs.getCardById(id);

    if(!card) return;

    const modal = await this.ac.create({
      header: this.translate.instant('NOTIFICATIONS.AlertTitle'),
      message: this.translate.instant('NOTIFICATIONS.AlertBody') + card.name,
      cssClass: 'dark-alert',
      buttons: [
        {
          text: "OK",
          role: "cancel"
        },
        {
          text: this.translate.instant('NOTIFICATIONS.AlertText'),
          role: "confirm",
          handler: async () => {
            card.status = Cardstatus.Done;
            await this.cs.updateCard(card);
          }
        }
      ]
    });
    await modal.present();
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
      await this.cs.syncOverdueTasks();

      event.target.complete();
    })
  }

  //OK
  async onFilterImportantChanged(event : any) {
    //On get la valeur boolean de la checkbox
    const value = event.detail.checked;
    console.log(value);
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

  //OK
  onFilterChanged(status: Cardstatus) {this.statusFilter$.next(status);}

  handleDateFilter(deadline: string) {return this.filterService.calculateDateFilter(deadline);}

  isTagChecked(tag: string) {return this.filter.tags.get(tag) ?? false;}

  get getCurrentLang(): string {return this.filterService.getCurrentLang;}

  getDateStringValue(value: string) {return this.filterService.getDateStringValue(value);}

  async clearFilters(){
    await this.filterService.clearFilters();
    console.log("Clear fait.");
  }

  protected readonly FilterDateEnum = FilterDateEnum;
}
