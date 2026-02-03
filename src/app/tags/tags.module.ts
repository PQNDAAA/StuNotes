import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagsPageRoutingModule } from './tags-routing.module';

import { TagsPage } from './tags.page';
import {TagcardComponent} from "./tagcard/tagcard.component";
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TagsPageRoutingModule,
        TagcardComponent,
        TranslatePipe
    ],
  declarations: [TagsPage]
})
export class TagsPageModule {}
