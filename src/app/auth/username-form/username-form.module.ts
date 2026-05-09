import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsernameFormPageRoutingModule } from './username-form-routing.module';

import { UsernameFormPage } from './username-form.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        UsernameFormPageRoutingModule,
        TranslatePipe
    ],
  declarations: [UsernameFormPage]
})
export class UsernameFormPageModule {}
