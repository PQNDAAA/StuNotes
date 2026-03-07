import {NgModule, inject, APP_INITIALIZER} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

// import ngx-translate and the http loader
import {provideHttpClient} from "@angular/common/http";
import {provideTranslateService, TranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslatePipe, TranslateDirective} from '@ngx-translate/core';
import {Settings} from "./settings/settings-service/settings";
import {NgxsmkDatepickerModule } from 'ngxsmk-datepicker';
import {FilterService} from "./home/filter/service/filter-service";
import {CardsService} from "./cards/cards-service/cards-service";

export function initializeSettings(settings : Settings){
  return() => settings.initSettings()
}

export function initializeFilters(filters : FilterService){
  return () => filters.initFilters()
}

export function initializeCards(cards : CardsService){
  return () => cards.initCards()
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, TranslatePipe,
    TranslateDirective,NgxsmkDatepickerModule],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSettings,
      deps: [Settings],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeFilters,
      deps: [FilterService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeCards,
      deps: [CardsService],
      multi: true
    },
    provideHttpClient(),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json'
      })
    })],
  bootstrap: [AppComponent],
})
export class AppModule {
}
