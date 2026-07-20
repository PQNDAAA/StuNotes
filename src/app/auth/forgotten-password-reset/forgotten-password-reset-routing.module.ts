import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgottenPasswordResetPage } from './forgotten-password-reset.page';

const routes: Routes = [
  {
    path: '',
    component: ForgottenPasswordResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgottenPasswordResetPageRoutingModule {}
