/**
 * @file form-hotel.component.ts
 * @brief This file contains the FormHotelComponent.
 */

import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';
import { hotels } from '../../models';
import { UserService } from '../../services';
import { Router, RouterLink } from '@angular/router';

/**
 * @class FormHotelComponent
 * @brief Represents the FormHotelComponent.
 * 
 * This component is responsible for displaying and handling the form for adding or editing a hotel.
 */
@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.scss'],
})
export class FormHotelComponent implements OnInit {
  esMovil: boolean; // Flag indicating whether the device is a mobile
  esPc: boolean; // Flag indicating whether the device is a desktop
  provincias: string[] = ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'];

  form: FormGroup; // The form group for the hotel form
  mode: 'New' | 'Edit' = 'New'; // The mode of the form (New or Edit)
  currentImage = new BehaviorSubject<string>(''); // The current image for the hotel
  currentImage$ = this.currentImage.asObservable(); // Observable for the current image

  @Input('user') set hotel(hotel: hotels) {
    // Setter for the hotel input property
    if (hotel) {
      this.form.controls.id.setValue(hotel.id);
      this.form.controls.docId.setValue(hotel.docId);
      console.log("Valor de docId:", hotel.docId);
      this.form.controls.name_hotel.setValue(hotel.name_hotel);
      this.form.controls.localtion_hotel.setValue(hotel.localtion_hotel);
      this.form.controls.info_hotel.setValue(hotel.info_hotel);
      this.form.controls.url_img.setValue(hotel.url_img);
      
      if (hotel.url_img) 
        this.currentImage.next(hotel.url_img);
      this.form.controls.pictureFile.setValue(null);
      this.mode = 'Edit';
    }
  }

  constructor(
    public platform: PlatformService,
    private photoSvc: PhotoService,
    private fb: FormBuilder,
    private modal: ModalController,
    private cdr: ChangeDetectorRef,
    private user: UserService,
    private router: Router
  ) {
    // Initialize the form group
    this.form = this.fb.group({
      id: [null],
      docId: [''],
      name_hotel: ['', [Validators.required]],
      localtion_hotel: ['', [Validators.required]],
      info_hotel: ['', [Validators.required]],
      url_img: [''],
      pictureFile: [null],
    })
  }

  ngOnInit() {
    this.onResize();
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
   * @brief Handles the form submission.
   */
  onSubmit() {
    this.modal.dismiss({ hotel: this.form.value, mode: this.mode }, 'ok');
  }

  /**
   * @brief Closes the modal without saving changes.
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
   * @brief Changes the picture for the hotel.
   * @param fileLoader The HTML input element for file loading.
   * @param mode The mode for getting the picture (library, camera, or file).
   */
  async changePic(
    fileLoader: HTMLInputElement,
    mode: 'library' | 'camera' | 'file'
  ) {
    var item: PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls.pictureFile.setValue(item.blob);
  }
}
