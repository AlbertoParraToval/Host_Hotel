import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HotelsPage } from './hotels.page';

const routes: Routes = [
  {
    path: '',
    component: HotelsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelsPageRoutingModule {}
