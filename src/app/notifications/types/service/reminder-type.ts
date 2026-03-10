import { Injectable } from '@angular/core';
import {ReminderTypeEnum} from "../reminder-type-enum";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class ReminderType {

  constructor(private translateService: TranslateService) {
  }


  getReminderTypeValue(type: ReminderTypeEnum): string {
    let value = "";
    this.translateService.get(`REMINDERTYPE.${ type }`).subscribe(reminderType => {
      value = reminderType;
    })
    return value;
  }

}
