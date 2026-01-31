import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Cardstatus} from "./cards/cardstatus";

@Injectable({
  providedIn: 'root'
})
export class CardStatusService {

  constructor(private translate: TranslateService) {}

  getStatus(key: Cardstatus){
    return this.translate.get(`STATUS.${key}`);
  }

}
