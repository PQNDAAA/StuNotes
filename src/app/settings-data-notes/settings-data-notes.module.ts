import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsDataNotesPageRoutingModule } from './settings-data-notes-routing.module';

import { SettingsDataNotesPage } from './settings-data-notes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsDataNotesPageRoutingModule
  ],
  declarations: [SettingsDataNotesPage]
})
export class SettingsDataNotesPageModule {}
