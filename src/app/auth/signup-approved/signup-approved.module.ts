import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupApprovedPageRoutingModule } from './signup-approved-routing.module';

import { SignupApprovedPage } from './signup-approved.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupApprovedPageRoutingModule
  ],
  declarations: [SignupApprovedPage]
})
export class SignupApprovedPageModule {}
