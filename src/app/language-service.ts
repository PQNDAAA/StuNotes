import { Injectable } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) {
  }

}
