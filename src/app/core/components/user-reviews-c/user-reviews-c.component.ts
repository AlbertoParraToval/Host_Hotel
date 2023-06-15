/**
 * @file user-reviews-c.component.ts
 * @brief This file contains the UserReviewsCComponent.
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelsService, ReviewsService, UserService } from '../../services';
import { Reviews, hotels, User } from '../../models';

import { IonItemSliding } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleService } from '../../services/locale.service';

/**
 * @class UserReviewsCComponent
 * @brief Represents the UserReviewsCComponent.
 * 
 * This component is responsible for displaying and managing user reviews.
 */
@Component({
  selector: 'app-user-reviews-c',
  templateUrl: './user-reviews-c.component.html',
  styleUrls: ['./user-reviews-c.component.scss'],
})
export class UserReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter<Reviews>();
  @Output() onDelete = new EventEmitter<Reviews>();
  @Input('review') set review(review: Reviews) {
    this._reviews = review;
    this.loadTaskAndPerson(review);
  }
  private async loadTaskAndPerson(review: Reviews) {
    this._hotels.next(await this.hotelsSvc.gethotelById(review.id_hoteles));
    this._users.next(await this.userSvc.getUserById(review.id_user));
  }

  get reviews(): Reviews {
    return this._reviews;
  }

  private _reviews: Reviews;

  private _users: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _hotels: BehaviorSubject<hotels> = new BehaviorSubject<hotels>(null);
  user$: Observable<User> = this._users.asObservable();
  hotels$: Observable<hotels> = this._hotels.asObservable();

  constructor(
    private userSvc: UserService,
    private hotelsSvc: HotelsService,
    public locale: LocaleService
  ) {}

  ngOnInit() {}

  /**
   * @brief Handles the edit button click event.
   */
  onEditClick() {
    this.onEdit.emit(this.reviews);
  }

  /**
   * @brief Handles the delete button click event.
   */
  onDeleteClick() {
    this.onDelete.emit(this.reviews);
  }
}
