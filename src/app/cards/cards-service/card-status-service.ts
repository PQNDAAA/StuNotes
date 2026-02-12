import {Injectable, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Cardstatus} from "../cards-enum/cardstatus";
import {CardstatusColors} from "../cards-const/cardstatus-colors";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CardStatusService implements OnInit {

  allStatus = Object.values(Cardstatus);

  statusColorLanguage : Array<{status: string; color: string}> = [];
  statusColor = CardstatusColors;

  constructor(private translate: TranslateService) {
    this.createStatusColor();
  }

  ngOnInit(): void {}

  getStatus(key: Cardstatus): string {
    let value = "";
    this.translate.get(`STATUS.${key}`).subscribe(status => {
      value = status;
    })
    return value;
  }

  createStatusColor(){
    this.translate.get(`STATUS`).subscribe(values => {
      this.statusColorLanguage = [];

      for(const status of this.allStatus){
        this.statusColorLanguage.push({
          status: values[status],
          color: this.statusColor[status]
        });
      }
    });
  }
}
