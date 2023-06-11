/**
 * @file settings.page.ts
 * @brief This file contains the SettingsPage component.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UpdateUserFormComponent, User, UserService } from 'src/app/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';
import { LocaleService } from 'src/app/core/services/locale.service';

/**
 * @class SettingsPage
 * @brief Represents the settings page component.
 * 
 * This component is responsible for managing user settings.
 */
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  language = 1; // 0 for Spanish, 1 for English
  currentLanguage;
  esMovil: boolean;
  esPc: boolean;
  
  constructor(
    private firebase: FirebaseService,
    private translate: TranslateService,
    private locale: LocaleService,
    private userSvc: UserService,
    private modal: ModalController,
    private alert: AlertController,
    public user: UserService,
    private router: Router
  ) {}

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {
    this.onResize();
  }
  
  /**
   * @brief Get the active user.
   * @return The active user.
   */
  getUserActive(): User {
    return this.userSvc.currentUser;
  }

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Initializes the component.
   * 
   * Sets the default language to English.
   */
  private async init() {
    this.translate.setDefaultLang('en');
  }

  /**
   * @brief Performs additional initialization after the view has been initialized.
   */
  ngAfterViewInit(): void {}

  /**
   * @brief Presents the user update form as a modal.
   * @param userdata The user data to be updated.
   */
  async presentFormUser(userdata: User) {
    const modal = await this.modal.create({
      component: UpdateUserFormComponent,
      componentProps: {
        user: userdata,
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.userSvc.updateUser(result.data.user);
    });
  }

  /**
   * @brief Handles the edit user action by presenting the user update form.
   * @param user The user to be edited.
   */
  onEditUser(user: User) {
    this.presentFormUser(user);
  }

  /**
   * @brief Sets the selected language as the default language and registers the culture for localization.
   * @param languageCode The code of the selected language.
   */
  onLanguage(languageCode: string) {
    this.translate.setDefaultLang(languageCode);
    this.locale.registerCulture(languageCode);
  }

  /**
   * @brief This function is executed whenever the window is resized.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the window width is less than 768, it's considered a mobile screen
    this.esPc = window.innerWidth > 768; // If the window width is greater than 768, it's considered a desktop screen
  }

  /**
   * @brief Shows the delete user alert with a confirmation dialog.
   * @param user The user to be deleted.
   */
  async onDeleteUserAlert(user: User) {
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.deleteUser')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('home.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operation canceled");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('home.delete')),
          role: 'confirm',
          handler: () => {
            this.userSvc.deleteUser(user);
            this.userSvc.signOut();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  /**
   * @brief Handles the delete user action.
   * @param user The user to be deleted.
   */
  onDeleteUser(user: User) {
    this.onDeleteUserAlert(user);
  } 
}
