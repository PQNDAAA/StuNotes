import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgottenPasswordResetPageRoutingModule } from './forgotten-password-reset-routing.module';

import { ForgottenPasswordResetPage } from './forgotten-password-reset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForgottenPasswordResetPageRoutingModule
  ],
  declarations: [ForgottenPasswordResetPage]
})
export class ForgottenPasswordResetPageModule {}
