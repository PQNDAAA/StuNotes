import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {AddnoteComponent} from "./addnote.component";

@NgModule({
  imports: [CommonModule,FormsModule,IonicModule],
  declarations: [AddnoteComponent],
  exports: [AddnoteComponent]
})

export class AddnoteModule{}
