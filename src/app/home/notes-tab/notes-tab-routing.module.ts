import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotesTabPage } from './notes-tab.page';

const routes: Routes = [
  {
    path: '',
    component: NotesTabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotesTabPageRoutingModule {}
