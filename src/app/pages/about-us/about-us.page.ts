/**
 * @file about-us.page.ts
 * @brief This file contains the AboutUsPage.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core';

/**
 * @class AboutUsPage
 * @brief Represents the AboutUsPage.
 * 
 * This page is responsible for displaying information about the application or the company.
 */
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  
  constructor(
    public user: UserService,
    private router: Router
  ) {}

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {
    this.onResize();
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

