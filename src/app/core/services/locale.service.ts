import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class LocaleService {

  private _locale: string;

  constructor(
    private toastController: ToastController,
    private storage: Storage
  ) {
    this.initLocale();
  }

  private async initLocale() {
    await this.storage.create();
    const storedLocale = await this.storage.get('idiomaPreferido');
    this._locale = storedLocale || 'en-US';
  }

  set locale(value: string) {
    this._locale = value;
    this.saveLocale();
  }

  get locale(): string {
    return this._locale;
  }

  private async saveLocale() {
    await this.storage.set('idiomaPreferido', this._locale);
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

      default:
        this._locale = 'en-uk';
        msg = "Translation in English";
        console.log('Application Culture Set to English');
        break;
    }

    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 10
    });
    toast.present();

    this.saveLocale();
  }
}
