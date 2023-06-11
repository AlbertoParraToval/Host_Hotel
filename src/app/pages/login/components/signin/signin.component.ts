/**
 * @file signin.component.ts
 * @brief This file contains the SigninComponent.
 */

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { RegisterComponent } from '../register/register.component';
import { User } from 'src/app/core/models/user.model';
import { lastValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RpasswordComponent } from '../rpassword/rpassword.component';

/**
 * @class SigninComponent
 * @brief Represents the SigninComponent.
 * 
 * This component is responsible for handling user sign-in.
 */
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  @Input() user_: User;
  
  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private user: UserService,
    private router: Router,
    public loadingController: LoadingController,
    private translate: TranslateService,
    public toastcontroler: ToastController
  ) {
    this.form = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {}

  /**
   * @brief Opens the registration modal and displays a loading indicator.
   */
  async register() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1000 // Optional, duration of the loading indicator (in milliseconds)
    });
    await loading.present();

    const modal = await this.modalCtrl.create({
      component: RegisterComponent,
      componentProps: {
        cssClass: 'my-custom-class',
        backdropDismiss: true,
        mode: 'md',
        height: '90%',
        width: '90%',
      },
    });

    modal.onDidDismiss().then(async (response) => {
      try {
        if (response.role == 'ok') {
          await this.user.register(response.data);
          this.router.navigate(['home'], { replaceUrl: true });
        }
      } catch (error) {
        console.log(error);
      }
    });
    modal.present();
  }

  /**
   * @brief Attempts to sign in the user and navigates to the home page.
   */
  async onSignIn() {
    try {
      await this.user.login(this.form.value);
      this.router.navigate(['home'], { replaceUrl: true });
      const toast = await this.toastcontroler.create({
        message: 'Bienvenido ' + this.user_.first_name + ' ' + this.user_.last_name,
        duration: 4000
      });
      await toast.present();
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @brief Checks if the form has a specific error.
   * @param error The error to check.
   * @return True if the form has the error, false otherwise.
   */
  hasFormError(error) {
    return (
      this.form?.errors &&
      Object.keys(this.form.errors).filter((e) => e == error).length == 1
    );
  }

  /**
   * @brief Converts the form errors to an array.
   * @param errors The form errors.
   * @return The array of errors.
   */
  errorsToArray(errors) {
    if (errors && !('required' in errors)) return [Object.keys(errors)[0]];
    else return [];
  }

  /**
   * @brief Opens the password recovery modal.
   */
  async recoverPassword(){
    const modal = await this.modalCtrl.create({
      component:RpasswordComponent,
      cssClass:"modal-full-right-side",
    });

    modal.onDidDismiss().then(async (response) => {
      try{
        if(response.role = 'ok'){
          console.log(response.data.email)
          await this.user.recoverPassword(response.data.email);
        }
      }catch(error){
        console.log(error);
      }
    });
    modal.present();
  }
}
