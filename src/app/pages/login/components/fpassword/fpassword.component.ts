import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';

@Component({
  selector: 'app-fpassword',
  templateUrl: './fpassword.component.html',
  styleUrls: ['./fpassword.component.scss'],
})
export class FpasswordComponent implements OnInit {
  email: string;
  message: string;
  constructor(private firebaseService: FirebaseService) {}
  ngOnInit(): void {
    
  }
  resetPassword(): void {
    this.firebaseService.resetPassword(this.email)
      .then(() => {
        this.message = 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña.';
      })
      .catch((error) => {
        console.error(error);
        this.message = 'Se ha producido un error al enviar el correo electrónico de restablecimiento de contraseña. Por favor, inténtalo de nuevo más tarde.';
      });
  }
}

