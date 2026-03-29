import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import {AddnoteComponent} from "./addnote.component";
import {TranslatePipe} from "@ngx-translate/core";
import {NgxsmkDatepickerComponent} from "ngxsmk-datepicker";
import {CustomRemindersModalComponent} from "../../custom-reminders-modal/custom-reminders-modal.component";

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, TranslatePipe, NgxsmkDatepickerComponent, CustomRemindersModalComponent],
  declarations: [AddnoteComponent],
  exports: [AddnoteComponent]
})

export class AddnoteModule{}
