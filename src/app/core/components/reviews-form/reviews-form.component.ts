/**
 * @file reviews-form.component.ts
 * @brief This file contains the ReviewsFormComponent.
 */

import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { Reviews, hotels, User } from '../../models';
import { HotelsService, UserService } from '../../services';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';
import { FirebaseDocument, FirebaseService } from '../../services/firebase/firebase-service';
import { TranslateService } from '@ngx-translate/core';

/**
 * @class ReviewsFormComponent
 * @brief Represents the ReviewsFormComponent.
 * 
 * This component is responsible for displaying and handling the form for creating or editing reviews.
 */
@Component({
  selector: 'app-reviews-form',
  templateUrl: './reviews-form.component.html',
  styleUrls: ['./reviews-form.component.scss'],
})
export class ReviewsFormComponent implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  button_text = "";
  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';
  currentImage = new BehaviorSubject<string>('');
  currentImage$ = this.currentImage.asObservable();
  @Input('review') set review(review: Reviews) {
    if (review) {
      this.form.controls.id.setValue(review.id);
      this.form.controls.docId.setValue(review.docId || '');
      this.form.controls.id_user.setValue(review.id_user);
      this.form.controls.id_hoteles.setValue(review.id_hoteles);
      this.form.controls.text_review.setValue(review.text_review);
      this.form.controls.rating.setValue(review.rating);
      this.form.controls.fecha.setValue(review.fecha);
      this.mode = "Edit"
    }
  }
  @Input() user_: User;
  @Input() hotel: hotels;

  constructor(
    public platform: PlatformService,
    private photoSvc: PhotoService,
    private fb: FormBuilder,
    private modal: ModalController,
    private cdr: ChangeDetectorRef,
    private user: UserService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      id: [null],
      docId: [''],
      id_user: [''],
      id_hoteles: [''],
      text_review: ['', [Validators.required]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      fecha: [new Date().toISOString()],
    });
  }

  stars: number[] = [1, 2, 3, 4, 5];

  /**
   * @brief Sets the rating value in the form.
   * @param star The selected star value.
   */
  setRating(star: number) {
    this.form.controls.rating.setValue(star);
  }

  /**
   * @brief Initializes the component.
   */
  async ngOnInit() {
    if (this.mode == "Edit") {
      this.button_text = await lastValueFrom(this.translate.get('settings.btn_edit'));
    } else {
      this.button_text = await this.translate.get('settings.btn_new').toPromise();
    }

    this.onResize();
    this.populateForm();
    const currentUser = this.user.currentUser;
    if (currentUser) {
      this.form.controls.id_user.setValue(currentUser.docId);
    }
  }

  /**
   * @brief Handles the window resize event.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the screen width is less than 768, it is considered a mobile screen
    this.esPc = window.innerWidth > 768; // If the screen width is greater than 768, it is considered a desktop screen
  }

  /**
   * @brief Handles the form submission.
   */
  onSubmit() {
    this.modal.dismiss({ review: this.form.value, mode: this.mode }, 'ok');
  }

  /**
   * @brief Dismisses the modal without returning any result.
   * @param result The result data.
   */
  onDismiss(result) {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Changes the profile picture.
   * @param fileLoader The file input element.
   * @param mode The mode for selecting the picture.
   */
  async changePic(fileLoader: HTMLInputElement, mode: 'library' | 'camera' | 'file') {
    var item: PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls.pictureFile.setValue(item.blob);
  }

  /**
   * @brief Populates the form with the review data.
   */
  populateForm() {
    if (this.review) {
      // ...
      if (!this.review.id_hoteles && this.hotel) {
        this.form.controls.id_hoteles.setValue(this.hotel.docId);
      }
    }
  }
}
