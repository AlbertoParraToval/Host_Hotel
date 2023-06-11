import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { IsAdminPipe, Reviews, ReviewsFormComponent, ReviewsService, User, UserService, hotels } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers:[IsAdminPipe]
})
export class HomePage {
  esMovil: boolean;
  esPc: boolean;
  currentUser: User; // Variable para el usuario actual
  selectedHotel: hotels; // Variable para el hotel seleccionado


  constructor(
    public user:UserService,
    private router:Router,
    private reviewSvc:ReviewsService,
    private alert: AlertController,
    private modal: ModalController
  ) { }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }

  ngOnInit() {  this.onResize();
}
 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }


  async presentFormUser(reviewdata: Reviews) {
    const modal = await this.modal.create({
      component: ReviewsFormComponent,
      componentProps: {
        review: reviewdata,
        user_: this.currentUser, 
        hotel: this.selectedHotel
      },
    });
  
    modal.onDidDismiss().then(result => {
      if (result.role === 'ok') {
        const addReview = result.data.review;
        this.reviewSvc.addReview(addReview);
      } else {
        console.log("No se ha podido añadir");
      }
    });
  
    await modal.present();
  }
  


  onAddReview(reviewdata){
    this.presentFormUser(null);
  }
}
