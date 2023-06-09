import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Reviews, hotels } from '../../models';
import { UserService } from '../../services';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-reviews-form',
  templateUrl: './reviews-form.component.html',
  styleUrls: ['./reviews-form.component.scss'],
})
export class ReviewsFormComponent implements OnInit {
  esMovil:boolean;
  esPc:boolean;
  
    form: FormGroup;
    mode: 'New' | 'Edit' = 'New';
    currentImage = new BehaviorSubject<string>('');
    currentImage$ = this.currentImage.asObservable();
    @Input('review') set review(review: Reviews) {
      if (review) {
        this.form.controls.id.setValue(review.id);
        this.form.controls.docId.setValue(review.docId);
        this.form.controls.id_user.setValue(review.id_user);
        this.form.controls.id_hoteles.setValue(review.id_hoteles);
        this.form.controls.text_review.setValue(review.text_review);
        this.form.controls.rating.setValue(review.rating);
        this.form.controls.fecha.setValue(review.fecha);
      }
    }
  
    constructor(
      public platform: PlatformService,
      private photoSvc: PhotoService,
      private fb: FormBuilder,
      private modal: ModalController,
      private cdr: ChangeDetectorRef,
      private user:UserService,
      private router:Router
    ) {
      this.form = this.fb.group({
        id: [null],
        docId: [''],
        id_user: [''],
        id_hoteles: [''],
        text_review: ['', [Validators.required]],
        rating: ['',[Validators.required]],
        fecha:[new Date().toISOString()] 
      });
    }
  
    ngOnInit() {  this.onResize();}
    // Esta función se ejecuta cada vez que se redimensiona la pantalla
      @HostListener('window:resize', ['$event'])
      onResize(event?) {
        this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
        this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
      }
  
    onSubmit() {
      this.modal.dismiss({ review: this.form.value, mode: this.mode }, 'ok');
    }
  
    onDismiss(result) {
      this.modal.dismiss(null, 'cancel');
    }
  
    signOut(){
      this.user.signOut();
      this.router.navigate(['login']);
    }
  
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
