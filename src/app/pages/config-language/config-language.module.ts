import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConfigLanguagePageRoutingModule } from './config-language-routing.module';

import { ConfigLanguagePage } from './config-language.page';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/core/utils/translate';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfigLanguagePageRoutingModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
  ],
  declarations: [ConfigLanguagePage]
})
export class ConfigLanguagePageModule {}
