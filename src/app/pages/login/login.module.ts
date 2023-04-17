import { NgModule } from '@angular/core';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent} from './components/register/register.component';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';
import { createTranslateLoader } from 'src/app/core/utils/translate';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@NgModule({
  imports: [
    CoreModule,
    ReactiveFormsModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
    LoginPageRoutingModule
  ],
  declarations: [LoginPage, SigninComponent, RegisterComponent]
})
export class LoginPageModule {}
