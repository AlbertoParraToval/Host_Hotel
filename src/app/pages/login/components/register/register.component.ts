/**
 * @file register.component.ts
 * @brief This file contains the RegisterComponent.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PasswordValidation } from 'src/app/core/utils/password-validator';

/**
 * @class RegisterComponent
 * @brief Represents the RegisterComponent.
 * 
 * This component is responsible for handling user registration.
 */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) {
    this.form = this.formBuilder.group({
      first_name: ["", Validators.required],
      last_name: ["", Validators.required],
      admin: [false],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      username: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      profilePick: ['https://ionicframework.com/docs/img/demos/avatar.svg']
    }, {
      validator: [PasswordValidation.passwordMatch, PasswordValidation.passwordProto]
    });
  }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {}

  /**
   * @brief Registers the user and dismisses the modal with the user data as the result.
   */
  onRegister() {
    this.modalCtrl.dismiss({
      email: this.form.value.email,
      username: this.form.value.email,
      password: this.form.value.password,
      first_name: this.form.value.first_name,
      admin: this.form.value.admin,
      last_name: this.form.value.last_name,
      profilePick: this.form.value.profilePick
    }, 'ok');
  }

  /**
   * @brief Checks if the form has the specified error.
   * @param error The error to check.
   * @returns True if the form has the error, false otherwise.
   */
  hasFormError(error) {
    return this.form?.errors && Object.keys(this.form.errors).filter(e => e == error).length == 1;
  }

  /**
   * @brief Converts the errors object to an array of errors.
   * @param errors The errors object.
   * @returns An array of errors.
   */
  errorsToArray(errors) {
    if (errors && !('required' in errors))
      return [Object.keys(errors)[0]];
    else
      return [];
  }

  /**
   * @brief Dismisses the modal without any result.
   */
  onDismiss() {
    this.modalCtrl.dismiss();
  }
}
