import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({providedIn:'root'})
export class LocaleService {
  
  constructor(private toastController: ToastController) { }

  private _locale: string;

  set locale(value: string) {
    this._locale = value;
  }
  get locale(): string {
    return this._locale || 'en-US';
  }

  public async registerCulture(culture: string) {
    let msg = "";

    if (!culture) {
      return;
    }
    switch (culture) {
      case 'es':
        case 'es-es':
          this._locale = 'es-es';
          msg = "Traducción a español";
          console.log('Application Culture Set to Spanish');
          break;   

      case 'fr':
        case 'fr-fr':
          this._locale = 'fr-fr';
          msg = "Traduction française";
          console.log('Application Culture Set to French');
          break;
      
      case 'en-us':
        this._locale = 'en-us';
        msg = "Translation in English";
        console.log('Application Culture Set to English');
          break;
      case 'gb':
      case 'en':
      case 'en-uk': 
        this._locale = 'en-uk';
        msg = "Translation in English";
        console.log('Application Culture Set to English');
        break;
      
      default: {
        this._locale = 'en-uk';
        msg = "Translation in English";
        console.log('Application Culture Set to English');
        break;
      }
    }
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 1000
    });
    toast.present();
  }
}