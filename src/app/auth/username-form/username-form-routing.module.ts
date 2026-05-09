import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsernameFormPage } from './username-form.page';

const routes: Routes = [
  {
    path: '',
    component: UsernameFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsernameFormPageRoutingModule {}
