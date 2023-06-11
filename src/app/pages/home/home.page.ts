/**
 * @file home.page.ts
 * @brief This file contains the HomePage.
 */

import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IsAdminPipe, Reviews, ReviewsFormComponent, ReviewsService, User, UserService, hotels } from 'src/app/core';

/**
 * @class HomePage
 * @brief Represents the HomePage.
 * 
 * This page is responsible for displaying the home screen and managing user-related operations.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [IsAdminPipe]
})
export class HomePage {
  esMovil: boolean;
  esPc: boolean;
  currentUser: User; // Variable for the current user
  selectedHotel: hotels; // Variable for the selected hotel

  constructor(
    public user: UserService,
    private router: Router,
    private reviewSvc: ReviewsService,
    private alert: AlertController,
    private modal: ModalController
  ) { }

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

  /**
   * @brief Presents the user review form modal for creating a new review.
   * @param reviewdata The data of the review to be added (optional).
   */
  async presentFormUser(reviewdata: Reviews) {
    const modal = await this.modal.create({
      component: ReviewsFormComponent,
      componentProps: {
        review: reviewdata,
        user_: this.currentUser,
        hotel: this.selectedHotel
      },
    });

    modal.onDidDismiss().then(result => {
      if (result.role === 'ok') {
        const addReview = result.data.review;
        this.reviewSvc.addReview(addReview);
      } else {
        console.log("No se ha podido añadir"); // Unable to add review
      }
    });

    await modal.present();
  }

  /**
   * @brief Handles the add review action.
   * @param reviewdata The data of the review to be added.
   */
  onAddReview(reviewdata) {
    this.presentFormUser(null);
  }
}
