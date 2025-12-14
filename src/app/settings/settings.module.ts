import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import {SettingsHomePage} from "../settings-home/settings-home.page";
import {SettingsHomePageModule} from "../settings-home/settings-home.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    SettingsHomePageModule,
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
