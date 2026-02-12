import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotesTabPageRoutingModule } from './notes-tab-routing.module';

import { NotesTabPage } from './notes-tab.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        NotesTabPageRoutingModule,
        TranslatePipe
    ],
  exports: [
    NotesTabPage
  ],
  declarations: [NotesTabPage]
})
export class NotesTabPageModule {}
