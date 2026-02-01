import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import {RouterLink} from "@angular/router";
import {TranslatePipe} from "@ngx-translate/core";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        RouterLink,
        TranslatePipe
    ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
