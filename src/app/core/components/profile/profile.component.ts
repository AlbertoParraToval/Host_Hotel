/**
 * @file profile.component.ts
 * @brief This file contains the ProfileComponent.
 */

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { LocaleService } from '../../services/locale.service';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { User } from '../../models';
import { TranslateService } from '@ngx-translate/core';

/**
 * @class ProfileComponent
 * @brief Represents the ProfileComponent.
 * 
 * This component is responsible for displaying the user profile and handling user actions such as edit and delete.
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  language = 1; // 0 for Spanish, 1 for English
  currentLanguage;
  @Output() onEdit = new EventEmitter(); // Event emitted when the edit button is clicked
  @Output() onDelete = new EventEmitter(); // Event emitted when the delete button is clicked
  @Input() user: User; // The user profile to display
  esPc: boolean; // Flag indicating whether the device is a desktop
  esMovil: boolean; // Flag indicating whether the device is a mobile
  selectedLanguage: string;
  languageOptions: { code: string; name: string; }[];


  constructor(
    public locale: LocaleService,
    public userSvc: UserService,
    public router: Router,
    private translate:TranslateService
  ) { }

  ngOnInit() {
    this.onResize();
    this.languageOptions = [
      {
        code: 'es',
        name: 'Español',
      },
      {
        code: 'en',
        name: 'English',
      },
      {
        code: 'fr',
        name: 'Français',
      },
    ],
    // Establecer el idioma seleccionado inicialmente
    this.selectedLanguage = this.translate.getDefaultLang();
    
  }

  onLanguageChange() {
    // Lógica para cambiar el idioma
    this.translate.setDefaultLang(this.selectedLanguage);
    // Otras acciones que puedas necesitar realizar al cambiar el idioma
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
   * @brief Handles the resize event of the window.
   * @param event The resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the screen width is less than 768, it's considered a mobile device
    this.esPc = window.innerWidth > 768; // If the screen width is greater than 768, it's considered a desktop device
  }

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.userSvc.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Handles the click event of the edit button.
   */
  onEditClick() {
    this.onEdit.emit(this.user);
  }

  /**
   * @brief Handles the click event of the delete button.
   */
  onDeleteClick() {
    this.onDelete.emit(this.user);
  }
}
