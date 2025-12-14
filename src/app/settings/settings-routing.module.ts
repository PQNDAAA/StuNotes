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
        path:'delete-allnotes',
        loadChildren: () =>
          import('../settings-dltallnotes/settings-dltallnotes.module').then(m => m.SettingsDltallnotesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
