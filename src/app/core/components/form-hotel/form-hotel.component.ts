import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';
import { hotels } from '../../models';

@Component({
  selector: 'app-form-hotel',
  templateUrl: './form-hotel.component.html',
  styleUrls: ['./form-hotel.component.scss'],
})
export class FormHotelComponent implements OnInit {
  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';
  currentImage = new BehaviorSubject<string>('');
  currentImage$ = this.currentImage.asObservable();
  @Input('hotel') set hotel(hotel: hotels) {
    if (hotel) {
      this.form.controls.id.setValue(hotel.id);
      this.form.controls.docId.setValue(hotel.docId);
      this.form.controls.first_name.setValue(hotel.name_hotel);
      this.form.controls.last_name.setValue(hotel.localtion_hotel);
      this.form.controls.nickname.setValue(hotel.info_hotel);
      this.form.controls.picture.setValue(hotel.url_img);
      
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
    private cdr: ChangeDetectorRef
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

  ngOnInit() {}

  onSubmit() {
    this.modal.dismiss({ hotel: this.form.value, mode: this.mode }, 'ok');
  }

  onDismiss(result) {
    this.modal.dismiss(null, 'cancel');
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