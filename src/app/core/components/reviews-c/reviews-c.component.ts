/**
 * @file reviews-c.component.ts
 * @brief This file contains the ReviewsCComponent.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelsService, ReviewsService, UserService } from '../../services';
import { Reviews, User, hotels } from '../../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleService } from '../../services/locale.service';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * @class ReviewsCComponent
 * @brief Represents the ReviewsCComponent.
 * 
 * This component is responsible for displaying and handling the reviews for a hotel.
 */
@Component({
  selector: 'app-reviews-c',
  templateUrl: './reviews-c.component.html',
  styleUrls: ['./reviews-c.component.scss'],
})
export class ReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter; // Event emitter for the edit event
  @Output() onDelete = new EventEmitter; // Event emitter for the delete event
  @Input('review') set review(review: Reviews) {
    this._review = review;
    this.loadUserHotel(review);
  }
  @Input() currentUser: User;

  public _hotel: BehaviorSubject<hotels> = new BehaviorSubject<hotels>(null);
  public _users: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  hotel$: Observable<hotels> = this._hotel.asObservable();
  user$: Observable<User> = this._users.asObservable();
  public review_C: BehaviorSubject<Reviews> = new BehaviorSubject<Reviews>(null);
  review$: Observable<Reviews> = this.review_C.asObservable();

  /**
   * @brief Loads the user and hotel associated with the review.
   * @param review The review object.
   */
  private async loadUserHotel(review: Reviews) {
    this._hotel.next(await this.hotelSvc.gethotelById(review.id_hoteles));
    console.log(review.id_hoteles);
    this._users.next(await this.userSvc.getUserById(review.id_user));
    console.log(review.id_user);
    this.review_C.next(await this.reviewSvc.getReviewById(review.text_review));
    console.log(review.text_review);
  }

  /**
   * @brief Returns the current review object.
   * @returns The current review.
   */
  getManage(): Reviews {
    return this._review;
  }

  public _review: Reviews;

  constructor(
    private userSvc: UserService,
    private hotelSvc: HotelsService,
    public locale: LocaleService,
    private reviewSvc: ReviewsService
  ) {}

  ngOnInit() {
    console.log(this.review_C);
    const textReview = this._review.text_review;
    console.log(textReview);
  }

  /**
   * @brief Handles the edit click event.
   */
  onEditClick() {
    this.onEdit.emit(this._review);
    console.log(this._review);
  }

  /**
   * @brief Handles the delete click event.
   */
  onDeleteClick() {
    this.onDelete.emit(this._review);
  }

  /**
   * @brief Returns an array of numbers representing the stars for the rating.
   * @param rating The rating value.
   * @returns An array of numbers representing the stars.
   */
  getStarsArray(rating: number): number[] {
    return Array.from({ length: rating }, (_, index) => index + 1);
  }
}
