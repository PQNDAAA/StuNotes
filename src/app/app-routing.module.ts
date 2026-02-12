import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./navigation-bar/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'notes',
    loadChildren: () => import('./home/notes/notes.module').then(m => m.NotesPageModule)
  },
  {
    path: 'tags',
    loadChildren: () => import('./tags/tags.module').then( m => m.TagsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'notes-tab',
    loadChildren: () => import('./home/notes-tab/notes-tab.module').then(m => m.NotesTabPageModule)
  },
  {
    path: 'settings-home',
    loadChildren: () => import('./settings/settings-home/settings-home.module').then(m => m.SettingsHomePageModule)
  },
  {
    path: 'settings-data-tags',
    loadChildren: () => import('./settings/settings-data-tags/settings-data-tags.module').then(m => m.SettingsDataTagsPageModule)
  },
  {
    path: 'settings-data-notes',
    loadChildren: () => import('./settings/settings-data-notes/settings-data-notes.module').then(m => m.SettingsDataNotesPageModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./profile/account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'first-launch',
    loadChildren: () => import('./first-launch/first-launch.module').then( m => m.FirstLaunchPageModule)
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
