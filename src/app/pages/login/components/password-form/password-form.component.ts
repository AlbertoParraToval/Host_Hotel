import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {

constructor(private firebaseService: FirebaseService) {}
  ngOnInit(): void {
  
  }

openResetPasswordModal() {
  const modal = document.getElementById("resetPasswordModal");
  modal.style.display = "block";
}

closeResetPasswordModal() {
  const modal = document.getElementById("resetPasswordModal");
  modal.style.display = "none";
}

resetPassword(event) {
  event.preventDefault(); // previene el comportamiento por defecto del formulario
  const email = event.target.email.value;
  this.firebaseService.resetPassword(email)
    .then(() => {
      alert("Se ha enviado un correo electrónico para restablecer la contraseña.");
      this.closeResetPasswordModal(); // cierra el modal
    })
    .catch((error) => {
      alert("No se pudo restablecer la contraseña. Por favor, inténtelo de nuevo más tarde.");
      console.error(error);
    });
}
}
