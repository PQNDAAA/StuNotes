import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'notes',
        loadChildren: () => import('../../home/notes/notes.module').then(m => m.NotesPageModule)
      },
      {
        path: 'tags',
        loadChildren: () => import('../../tags/tags.module').then(m => m.TagsPageModule)
      },
      {
        path: '',
        redirectTo: 'notes',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
