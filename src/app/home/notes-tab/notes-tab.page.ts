import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from "../../cards/cards-interface/card";
import {CardsService} from "../../cards/cards-service/cards-service";
import {Cardstatus} from "../../cards/cards-enum/cardstatus";
import {Observable} from "rxjs";
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

  cardStatus = Cardstatus;
  allStatus = Object.values(Cardstatus);
  defaultStatus = Cardstatus.InProgress;

  constructor(private cs: CardsService, private cardStatusService : CardStatusService) {

    console.log(this.cardStatusService.statusColorLanguage);

    this.cards = this.cs.cards$;
  }

  getStatus(key: Cardstatus){
    return this.cardStatusService.getStatus(key);
  }

  filterCardsCount(status: Cardstatus){
    return this.cs.filterCardsCount(status);
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
