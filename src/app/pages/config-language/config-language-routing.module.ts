import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigLanguagePage } from './config-language.page';

const routes: Routes = [
  {
    path: '',
    component: ConfigLanguagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigLanguagePageRoutingModule {}
