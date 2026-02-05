import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FirstLaunchPageRoutingModule } from './first-launch-routing.module';

import { FirstLaunchPage } from './first-launch.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FirstLaunchPageRoutingModule,
        NgOptimizedImage
    ],
  declarations: [FirstLaunchPage]
})
export class FirstLaunchPageModule {}
