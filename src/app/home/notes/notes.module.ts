import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesPageRoutingModule } from './notes-routing.module';

import { NotesPage } from './notes.page';
import {AddnoteModule} from "../../cards/addnote/addnote.module";
import {NotecardModule} from "../../cards/notecard/notecard.module";
import {NotesTabPageModule} from "../notes-tab/notes-tab.module";
import {TranslatePipe} from "@ngx-translate/core";
import {NgxsmkDatepickerComponent} from "ngxsmk-datepicker";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotesPageRoutingModule,
    AddnoteModule,
    NotecardModule,
    NotesTabPageModule,
    TranslatePipe,
    NgxsmkDatepickerComponent
  ],
  declarations: [NotesPage]
})
export class NotesPageModule {}
