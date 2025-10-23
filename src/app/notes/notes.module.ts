import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import {AddnoteModule} from "../cards/addnote/addnote.module";
import {NotecardModule} from "../cards/notecard/notecard.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    AddnoteModule,
    NotecardModule
  ],
  declarations: [NotesPage]
})
export class NotesPageModule {}
