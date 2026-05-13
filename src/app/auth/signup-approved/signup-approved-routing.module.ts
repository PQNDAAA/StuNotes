import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignupApprovedPage } from './signup-approved.page';

const routes: Routes = [
  {
    path: '',
    component: SignupApprovedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignupApprovedPageRoutingModule {}
