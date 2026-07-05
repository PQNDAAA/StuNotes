import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {InformationCardComponent} from "../information-card/information-card.component";
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ProfilePageRoutingModule,
        InformationCardComponent,
        TranslatePipe
    ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
