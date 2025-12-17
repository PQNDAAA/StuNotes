import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsDataTagsPageRoutingModule } from './settings-data-tags-routing.module';

import { SettingsDataTagsPage } from './settings-data-tags.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsDataTagsPageRoutingModule
  ],
  declarations: [SettingsDataTagsPage]
})
export class SettingsDataTagsPageModule {}
