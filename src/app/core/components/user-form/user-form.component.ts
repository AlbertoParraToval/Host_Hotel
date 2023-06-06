import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonItemSliding, ModalController } from '@ionic/angular';
import { User } from './../../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { hotels } from '../../models';
import { PhotoService, PhotoItem } from '../../services/photo.service';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  mode: 'New' | 'Edit' = 'New';
  currentImage = new BehaviorSubject<string>('');
  currentImage$ = this.currentImage.asObservable();
  @Input('user') set user(user: User) {
    if (user) {
      this.form.controls.uid.setValue(user.uid);
      this.form.controls.first_name.setValue(user.first_name);
      this.form.controls.last_name.setValue(user.last_name);
      this.form.controls.username.setValue(user.username);
      this.form.controls.profilePick.setValue(user.profilePick);
      
      if (user.profilePick) this.currentImage.next(user.profilePick);
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
      uid: [null],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      profilePick: [''],
      pictureFile: [null],
    });
  }

  ngOnInit() {}

  onSubmit() {
    this.modal.dismiss({ user: this.form.value, mode: this.mode }, 'ok');
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
