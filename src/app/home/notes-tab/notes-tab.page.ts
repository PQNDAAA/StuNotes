import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Card} from "../../cards/cards-interface/card";
import {CardsService} from "../../cards/cards-service/cards-service";
import {Cardstatus} from "../../cards/cards-enum/cardstatus";
import {Observable, of} from "rxjs";
import {CardStatusService} from "../../cards/cards-service/card-status-service";

@Component({
  selector: 'app-notes-tab',
  templateUrl: './notes-tab.page.html',
  styleUrls: ['./notes-tab.page.scss'],
  standalone: false
})
export class NotesTabPage implements OnInit {

  @Output() filterChanged = new EventEmitter<Cardstatus>();

  cards!: Observable<Card[]>;
  countsCards!: Observable<Map<Cardstatus,number>>;

  cardStatus = Cardstatus;
  allStatus = Object.values(Cardstatus);
  defaultStatus = Cardstatus.InProgress;

  constructor(private cs: CardsService, private cardStatusService : CardStatusService) {

    console.log(this.cardStatusService.statusColorLanguage);

    this.cards = this.cs.cards$;
    this.countsCards = this.cs.countCards$;
  }

  getStatus(key: Cardstatus){
    return this.cardStatusService.getStatus(key);
  }

  filterCardsCount(status: Cardstatus): number{
    let numberOfCards = 0;
    this.countsCards.subscribe(countCards => {
      numberOfCards = countCards.get(status) ?? 0;
    });
    return numberOfCards;
  }

  onSegmentChange(event: CustomEvent){
    const value = event.detail.value as Cardstatus | undefined;

    if (!value) return;
    this.filterChanged.emit(value);
  }

  getStatusColor(status: Cardstatus): string{
    return this.cs.getStatusColor(status);
  }

  ngOnInit() {
    this.filterChanged.emit(this.defaultStatus);
  }

  protected readonly Cardstatus = Cardstatus;
}
