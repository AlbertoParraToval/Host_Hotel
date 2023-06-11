/**
 * @file rpassword.component.ts
 * @brief This file contains the RpasswordComponent.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

/**
 * @class RpasswordComponent
 * @brief Represents the RpasswordComponent.
 * 
 * This component is responsible for handling password recovery.
 */
@Component({
  selector: 'app-rpassword',
  templateUrl: './rpassword.component.html',
  styleUrls: ['./rpassword.component.scss'],
})
export class RpasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
  ) {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {}
  
  /**
   * @brief Submits the form and dismisses the modal with the email as the result.
   */
  onSubmit() {
    this.modalController.dismiss({
      email: this.form.value.email,
    }, 'ok');
  }

  /**
   * @brief Dismisses the modal without any result.
   */
  onDismiss() {
    this.modalController.dismiss(null, 'cancel');
  }
}
