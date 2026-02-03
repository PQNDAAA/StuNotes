import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {AddnoteComponent} from "./addnote.component";
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, TranslatePipe],
  declarations: [AddnoteComponent],
  exports: [AddnoteComponent]
})

export class AddnoteModule{}
