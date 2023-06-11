/**
 * @file config-language.page.ts
 * @brief This file contains the ConfigLanguagePage.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';
import { LocaleService } from 'src/app/core/services/locale.service';

/**
 * @class ConfigLanguagePage
 * @brief Represents the ConfigLanguagePage.
 * 
 * This page is responsible for displaying the language configuration options and managing language-related operations.
 */
@Component({
  selector: 'app-config-language',
  templateUrl: './config-language.page.html',
  styleUrls: ['./config-language.page.scss'],
})
export class ConfigLanguagePage implements OnInit {
  language = 1; // 0 for Spanish, 1 for English
  currentLanguage;

  esMovil: boolean;
  esPc: boolean;

  constructor(
    private firebase: FirebaseService,
    private translate: TranslateService,
    private locale: LocaleService,
    public user: UserService,
    private router: Router
  ) { }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {
    this.onResize();
  }

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Initializes the language settings.
   */
  private async init() {
    this.translate.setDefaultLang('en');
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
   * @brief Handles the window resize event.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the window width is less than 768, it is considered to be a mobile screen
    this.esPc = window.innerWidth > 768; // If the window width is greater than 768, it is considered to be a desktop screen
  }
}
