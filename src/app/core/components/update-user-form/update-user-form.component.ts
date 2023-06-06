import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss'],
})
export class UpdateUserFormComponent implements OnInit {

  form:FormGroup;
  mode:"New" | "Edit" = "New";
  @Input('user') set user(user:User) {
    if(user) {    
      this.form.controls['id'].setValue(user.id);
      this.form.controls['docId'].setValue(user.docId);
      this.form.controls['admin'].setValue(user.admin);
      this.form.controls['first_name'].setValue(user.first_name);
      this.form.controls['last_name'].setValue(user.last_name);
      this.form.controls['email'].setValue(user.email)
      this.form.controls['username'].setValue(user.username);
      this.form.controls['profilePick'].setValue(user.profilePick);
      this.mode = "Edit";
    }
  }

  constructor(
    private fb:FormBuilder,
    private modal:ModalController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      id:[null],
      docId:[""],
      admin:[false],
      first_name:["", [Validators.required]],
      last_name:["", [Validators.required]],
      email:[""],
      username:["", [Validators.required]],
      profilePick:[""]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.controls['profilePick'].setValue(this.user.profilePick);
    }
  }

  onSubmit(){
    this.modal.dismiss({user: this.form.value, mode:this.mode}, 'ok');
  }

  hasFormError(error){
    return this.form?.errors && Object.keys(this.form.errors).filter(e=>e==error).length==1;
  }
  
  errorsToArray(errors){
  
    if(errors && !('required' in errors))
      return [Object.keys(errors)[0]];
    else
      return [];
  } 



  onDismiss(){
    this.modal.dismiss(null, 'cancel');
  }


  async presentToastAdd() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.userAdded')),
      duration: 1500,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }


  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef;

  passwordTypeInput  =  'password';

  togglePasswordMode() {
          
    this.passwordTypeInput = this.passwordTypeInput === 'text' ? 'password' : 'text';
      
      const nativeEl = this.passwordEye.nativeElement.querySelector('input');
      
      const inputSelection = nativeEl.selectionStart;
      
      nativeEl.focus();
      
      setTimeout(() => {
        nativeEl.setSelectionRange(inputSelection, inputSelection);
      }, 1);

  }

}
