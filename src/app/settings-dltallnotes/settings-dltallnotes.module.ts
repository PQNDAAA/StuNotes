import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsDltallnotesPageRoutingModule } from './settings-dltallnotes-routing.module';

import { SettingsDltallnotesPage } from './settings-dltallnotes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsDltallnotesPageRoutingModule
  ],
  declarations: [SettingsDltallnotesPage]
})
export class SettingsDltallnotesPageModule {}
