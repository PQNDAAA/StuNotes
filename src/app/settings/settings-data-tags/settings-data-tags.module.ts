import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsDataTagsPageRoutingModule } from './settings-data-tags-routing.module';

import { SettingsDataTagsPage } from './settings-data-tags.page';
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SettingsDataTagsPageRoutingModule,
        TranslatePipe
    ],
  declarations: [SettingsDataTagsPage]
})
export class SettingsDataTagsPageModule {}
