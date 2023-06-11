/**
 * @file update-user-form.component.ts
 * @brief This file contains the UpdateUserFormComponent.
 */

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../../models';

/**
 * @class UpdateUserFormComponent
 * @brief Represents the UpdateUserFormComponent.
 * 
 * This component is responsible for displaying and handling the form for updating a user.
 */
@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.scss'],
})
export class UpdateUserFormComponent implements OnInit {
  form: FormGroup; // The form group for the user update form
  mode: "New" | "Edit" = "New"; // The mode of the form, either "New" or "Edit"
  @Input('user') set user(user: User) {
    if (user) {
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

  @ViewChild('passwordEyeRegister', { read: ElementRef }) passwordEye: ElementRef; // Reference to the password eye icon

  passwordTypeInput = 'password'; // The type of the password input field

  constructor(
    private fb: FormBuilder,
    private modal: ModalController,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      id: [null],
      docId: [""],
      admin: [false],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email: [""],
      username: ["", [Validators.required]],
      profilePick: [""]
    });
  }

  ngOnInit() {
    if (this.user) {
      this.form.controls['profilePick'].setValue(this.user.profilePick);
    }
  }

  /**
   * @brief Handles the form submission event.
   */
  onSubmit() {
    this.modal.dismiss({ user: this.form.value, mode: this.mode }, 'ok');
  }

  /**
   * @brief Checks if the form has a specific error.
   * @param error The error to check.
   * @returns True if the form has the error, false otherwise.
   */
  hasFormError(error) {
    return this.form?.errors && Object.keys(this.form.errors).filter(e => e == error).length == 1;
  }

  /**
   * @brief Converts the form errors object to an array.
   * @param errors The form errors object.
   * @returns An array of errors.
   */
  errorsToArray(errors) {
    if (errors && !('required' in errors))
      return [Object.keys(errors)[0]];
    else
      return [];
  }

  /**
   * @brief Handles the dismiss event of the modal.
   */
  onDismiss() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * @brief Presents a toast for adding a user.
   */
  async presentToastAdd() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.userAdded')),
      duration: 1500,
      position: 'top',
      color: 'success'
    });

    await toast.present();
  }

  /**
   * @brief Toggles the password input field mode between text and password.
   */
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
