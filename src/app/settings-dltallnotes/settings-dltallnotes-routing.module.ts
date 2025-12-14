import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsDltallnotesPage } from './settings-dltallnotes.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsDltallnotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsDltallnotesPageRoutingModule {}
