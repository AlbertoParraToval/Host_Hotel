import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rpassword',
  templateUrl: './rpassword.component.html',
  styleUrls: ['./rpassword.component.scss'],
})
export class RpasswordComponent implements OnInit {
  form:FormGroup
  constructor(
    private formBuilder:FormBuilder,
    private modalController:ModalController,
    
  ) {
    this.form = this.formBuilder.group({
      email:["",[Validators.required, Validators.email]],
    });
  }

  ngOnInit() {}
  
  onSubmit(){
    this.modalController.dismiss({
      email:this.form.value.email,
    }, 'ok');
  }

  onDismiss(){
    this.modalController.dismiss(null,'cancel');
  }


}