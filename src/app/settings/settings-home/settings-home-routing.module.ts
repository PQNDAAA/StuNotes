import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsHomePage } from './settings-home.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsHomePageRoutingModule {}
