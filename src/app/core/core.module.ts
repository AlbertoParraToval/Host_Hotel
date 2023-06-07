import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';

import es from '@angular/common/locales/es';
import en from '@angular/common/locales/en';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from './utils/translate';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ClientsCComponent, FormHotelComponent, HotelCComponent, ProfileComponent, ReviewsCComponent, ReviewsFormComponent, UpdateUserFormComponent } from './components';


registerLocaleData(en);
registerLocaleData(es);

@NgModule({
  declarations: [
    HotelCComponent,
    FormHotelComponent,
    ProfileComponent,
    UpdateUserFormComponent,
    ClientsCComponent,
    ReviewsCComponent,
    ReviewsFormComponent
    


  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
      }
      }),
    IonicStorageModule.forRoot({
      name: 'hosthotel_',
          driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    ReactiveFormsModule
  ],
  exports:[
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HotelCComponent,
    FormHotelComponent,
    ProfileComponent,
    UpdateUserFormComponent,
    ClientsCComponent,
    ReviewsCComponent,
    ReviewsFormComponent
  ],
  providers:[
    {
      provide: LOCALE_ID,
      useValue: 'es'
    },
    Camera,
    File
  ]
})
export class CoreModule { }
