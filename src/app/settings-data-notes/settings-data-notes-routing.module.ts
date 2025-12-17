import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsDataNotesPage } from './settings-data-notes.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsDataNotesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsDataNotesPageRoutingModule {}
