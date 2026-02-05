import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstLaunchPage } from './first-launch.page';

const routes: Routes = [
  {
    path: '',
    component: FirstLaunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FirstLaunchPageRoutingModule {}
