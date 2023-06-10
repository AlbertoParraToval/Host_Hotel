import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Reviews, hotels, User } from '../../models';
import { HotelsService, UserService } from '../../services';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';
import { FirebaseDocument, FirebaseService } from '../../services/firebase/firebase-service';

@Component({
  selector: 'app-reviews-form',
  templateUrl: './reviews-form.component.html',
  styleUrls: ['./reviews-form.component.scss'],
})

export class ReviewsFormComponent implements OnInit {
  esMovil: boolean;
  esPc: boolean;

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
    private firebase:FirebaseService,
    private hotelSvc:HotelsService
  ) {
    this.form = this.fb.group({
      id: [null],
      docId: [''],
      id_user: [''],
      id_hoteles: [''],
      text_review: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      fecha: [new Date().toISOString()],
    });
  }

  ngOnInit() {
    this.onResize();
    this.populateForm(); 
    const currentUser = this.user.currentUser;
    if (currentUser) {
      this.form.controls.id_user.setValue(currentUser.docId);
    }

  }

  // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }

  onHotelSelected(hotel: hotels) {
    this.hotel = hotel;
  }

  onSubmit() {
    this.modal.dismiss({ review: this.form.value, mode: this.mode }, 'ok');
  }

  onDismiss(result) {
    this.modal.dismiss(null, 'cancel');
  }

  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  async changePic(fileLoader: HTMLInputElement, mode: 'library' | 'camera' | 'file') {
    var item: PhotoItem = await this.photoSvc.getPicture(mode, fileLoader);
    this.currentImage.next(item.base64);
    this.cdr.detectChanges();
    this.form.controls.pictureFile.setValue(item.blob);
  }

  populateForm() {
    if (this.review) {
      // ...
      if (!this.review.id_hoteles && this.hotel) {
        this.form.controls.id_hoteles.setValue(this.hotel.name_hotel); 
      }
    }
  }
}
