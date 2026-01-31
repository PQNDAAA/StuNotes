import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from "../cards/cards-interface/card";
import {CardsService} from "../cards/cards-service/cards-service";
import {Cardstatus} from "../cards/cardstatus";
import {map, Observable} from "rxjs";
import {TranslatePipe, TranslateDirective, TranslateService} from '@ngx-translate/core';

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
  defaultStatus = Cardstatus.InProgress;
  cardStatusValues = Object.values(Cardstatus);
  cardStatusKeys = Object.keys(Cardstatus);

  statusLanguageValues : any[] = [];

  constructor(private cs: CardsService, private translate: TranslateService) {
    this.translate.get('STATUS').subscribe(value => {
      this.checkStatusKeys(value);
    });

    this.cards = this.cs.cards$;
  }

  checkStatusKeys(arrayLanguage : any){
    const keysLanguage = Object.keys(arrayLanguage);

    for(const key of this.cardStatusKeys){
      if(keysLanguage.includes(key)){
        const value = arrayLanguage[key];
        this.statusLanguageValues.push(value);
      }
    }
    console.log(this.statusLanguageValues);
  }

  filterCardsCount(status: Cardstatus){
    return this.cs.filterCardsCount(status);
  }

  onSegmentChange(event: CustomEvent){
    const value = event.detail.value as Cardstatus | undefined;

    if (!value) return;

    this.filterChanged.emit(value);
  }

  getStatusColor(status: string): string{
    return this.cs.getStatusColor(status);
  }

  ngOnInit() {
    this.filterChanged.emit(this.defaultStatus);
  }

  protected readonly Cardstatus = Cardstatus;
}
