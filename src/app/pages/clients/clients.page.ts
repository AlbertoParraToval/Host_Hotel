/**
 * @file clients.page.ts
 * @brief This file contains the ClientsPage.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UpdateUserFormComponent, User, UserService } from 'src/app/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';
import { LocaleService } from 'src/app/core/services/locale.service';

/**
 * @class ClientsPage
 * @brief Represents the ClientsPage.
 * 
 * This page is responsible for managing clients, including displaying client information, updating client details, and deleting clients.
 */
@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
})
export class ClientsPage implements OnInit {

  language = 1; // 0 for Spanish, 1 for English
  currentLanguage;
  esMovil: boolean;
  esPc: boolean;
  allUser: User[]


  constructor(
    private firebase: FirebaseService,
    private translate: TranslateService,
    private locale: LocaleService,
    private userSvc: UserService,
    private modal: ModalController,
    private alert: AlertController,
    public user: UserService,
    private router: Router,
    private sanitize :DomSanitizer
  ) {}

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {

    this.getAllUsers().subscribe(allUser => {
      this.allUser = allUser;
    });
    this.onResize();
    this.user.getUserList();
  }
  
  /**
   * @brief Retrieves the active user.
   * @returns The active user.
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
   * @brief Retrieves all users.
   * @returns An observable of all users.
   */
  getAllUsers() {
    return this.user._user$;
  }

  /**
   * @brief Initializes the language settings.
   */
  private async init() {
    this.translate.setDefaultLang('en');
  }

  /**
   * @brief Handles the window resize event.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the window width is less than 768, it is considered to be a mobile screen
    this.esPc = window.innerWidth > 768; // If the window width is greater than 768, it is considered to be a desktop screen
  }

  /**
   * @brief Presents the user form modal for updating user details.
   * @param userdata The user data.
   */
  async presentFormUser(userdata: User) {
    const modal = await this.modal.create({
      component: UpdateUserFormComponent,
      componentProps: {
        user: userdata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      this.userSvc.updateUser(result.data.user);
    });
  }

  /**
   * @brief Handles the edit user action.
   * @param user The user to edit.
   */
  onEditUser(user: User) {
    this.presentFormUser(user);
  }

  /**
   * @brief Handles the language selection.
   * @param languageCode The code of the selected language.
   */
  onLanguage(languageCode: string) {
    this.translate.setDefaultLang(languageCode);
    this.locale.registerCulture(languageCode);
  }

  /**
   * @brief Handles the delete user action.
   * @param user The user to delete.
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
            console.log("Operacion cancelada");
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
   * @param user The user to delete.
   */
  onDeleteUser(user: User) {
    this.onDeleteUserAlert(user);
  }



  downloadJson(){
    console.log(this.allUser)
    this.userSvc.saveJsonFile(this.allUser);
  }

  getDownloadLink() {
    const filePath = 'src\\app\\core\\python\\datos.json';
    return this.sanitize.bypassSecurityTrustUrl(filePath);
  }

  downloadFile(): void {
    const filePath = '../../python/graficos_reporte.zip'; // Reemplaza con la ruta correcta a tu archivo JSON
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'report.zip'; // Reemplaza con el nombre que deseas que tenga el archivo JSON descargado
    link.target = '_blank'; // Para abrir el enlace en una nueva pestaña (opcional)
    link.click();
  }
}
