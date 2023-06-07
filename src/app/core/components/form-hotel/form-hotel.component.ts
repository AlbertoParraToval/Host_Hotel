import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';
import { hotels } from '../../models';
import { UserService } from '../../services';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.scss'],
})
export class FormHotelComponent implements OnInit {
esMovil:boolean;
esPc:boolean;


  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';
  currentImage = new BehaviorSubject<string>('');
  currentImage$ = this.currentImage.asObservable();
  @Input('user') set hotel(hotel: hotels) {
    if (hotel) {
      this.form.controls.id.setValue(hotel.id);
      this.form.controls.docId.setValue(hotel.docId);
      this.form.controls.name_hotel.setValue(hotel.name_hotel);
      this.form.controls.localtion_hotel.setValue(hotel.localtion_hotel);
      this.form.controls.info_hotel.setValue(hotel.info_hotel);
      this.form.controls.url_img.setValue(hotel.url_img);
      
      if (hotel.url_img) this.currentImage.next(hotel.url_img);
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
    private user:UserService,
    private router:Router
  ) {
    this.form = this.fb.group({
      id: [null],
      docId: [''],
      name_hotel: ['', [Validators.required]],
      localtion_hotel: ['', [Validators.required]],
      info_hotel: ['', [Validators.required]],
      url_img: [''],
      pictureFile: [null],
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
    this.modal.dismiss({ hotel: this.form.value, mode: this.mode }, 'ok');
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
