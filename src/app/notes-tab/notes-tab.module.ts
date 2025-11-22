import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesTabPageRoutingModule } from './notes-tab-routing.module';

import { NotesTabPage } from './notes-tab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesTabPageRoutingModule
  ],
  exports: [
    NotesTabPage
  ],
  declarations: [NotesTabPage]
})
export class NotesTabPageModule {}
