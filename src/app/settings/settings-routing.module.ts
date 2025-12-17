import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../settings-home/settings-home.module').then(m => m.SettingsHomePageModule)
      },
      {
        path:'data-tags',
        loadChildren: () =>
          import("../settings-data-tags/settings-data-tags.module").then(m => m.SettingsDataTagsPageModule)
      }
      ,
      {
        path:'data-notes',
        loadChildren: () =>
          import("../settings-data-notes/settings-data-notes.module").then(m => m.SettingsDataNotesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
