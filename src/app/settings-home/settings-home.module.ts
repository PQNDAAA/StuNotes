import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsHomePageRoutingModule } from './settings-home-routing.module';

import { SettingsHomePage } from './settings-home.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SettingsHomePageRoutingModule,
        TranslatePipe
    ],
  exports: [
    SettingsHomePage,
    SettingsHomePage
  ],
    declarations: [SettingsHomePage]
})
export class SettingsHomePageModule {}
