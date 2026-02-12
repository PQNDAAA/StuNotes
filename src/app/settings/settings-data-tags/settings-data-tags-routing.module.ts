import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsDataTagsPage } from './settings-data-tags.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsDataTagsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsDataTagsPageRoutingModule {}
