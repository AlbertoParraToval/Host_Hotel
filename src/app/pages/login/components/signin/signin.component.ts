import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private user: UserService,
    private router: Router,
    public loadingController: LoadingController
  ) {
    this.form = this.formBuilder.group({
      identifier: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}



  //Función que llama al modal de register donde tendrá una pantalla de carga de 1000s
  async register() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      duration: 1000 // Opcional, tiempo que durará la carga (en milisegundos)
    });
    await loading.present();

    const modal = await this.modalCtrl.create({
      component: RegisterComponent,
      componentProps: {
        cssClass: 'my-custom-class',
        // Opción para establecer el tamaño del modal
        backdropDismiss: true,
        mode: 'md',
        // Opciones para establecer el tamaño del modal
        height: '90%',
        width: '90%',
      },
    });


    //Si descartamos la opción de registro de usuario.
    modal.onDidDismiss().then(async (response) => {
      try {
        if (response.role == 'ok') {
          await this.user.register(response.data);
          this.router.navigate(['folder/Home'], { replaceUrl: true });
        }
      } catch (error) {
        console.log(error);
      }
    });
    modal.present();
  }


  //Función que sincroniza con la firebase para la comprobación de datos del usuario.
  async onSignIn() {
    try {
      await this.user.login(this.form.value);
      this.router.navigate(['folder/Home'], { replaceUrl: true });
    } catch (error) {
      console.log(error);
    }
  }

  hasFormError(error) {
    return (
      this.form?.errors &&
      Object.keys(this.form.errors).filter((e) => e == error).length == 1
    );
  }

  errorsToArray(errors) {
    if (errors && !('required' in errors)) return [Object.keys(errors)[0]];
    else return [];
  }
}
