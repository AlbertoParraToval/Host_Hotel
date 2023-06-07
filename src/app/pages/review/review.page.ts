import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { hotels, Reviews, UserService, HotelsService, ReviewsService, ReviewsFormComponent } from 'src/app/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  hotelReviews: Reviews[];

  constructor(
    public user:UserService,
    private router:Router,
    private modal:ModalController,
    private reviewSvc: ReviewsService,
    private alert:AlertController,
  ) { }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }

  ngOnInit() { 
    this.onResize();
  }

  

 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }


  getReviews(){
    return this.reviewSvc.reviews$;
  }

  async presentReviewForm(reviewdata: Reviews) {
    const modal = await this.modal.create({
      component: ReviewsFormComponent,
      componentProps: {
        review: reviewdata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        switch (result.data.mode) {
          case 'New':
            this.reviewSvc.addReview(result.data.review);
            break;
          case 'Edit':
            this.reviewSvc.updateReview(result.data.review.id, result.data.review);
            break;
          default:
        }
      }
    });
  }

  onEditReview(reviewdata){
    this.presentReviewForm(reviewdata);
  }

  onAddReview(reviewdata){
      this.presentReviewForm(null);
    }

  async onDeleteAlert(reviewdata){
    const alert = await this.alert.create({
      header:'Atención',
      message: '¿Estas seguro, no podrás volver atrás?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: 'Borrar',
          role: 'confirm',
          handler: () => {
            this.reviewSvc.deleteReview(reviewdata);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onReviewExistsAlert(reviewdata){
    const alert = await this.alert.create({
      header: 'Error',
      message: 'No es posible borrar el hotel.',
      buttons: [
        {
          text: 'Cerrar',
          role: 'close',
          handler: () => {
          
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onDeleteReview(reviewdata){
      this.onDeleteAlert(reviewdata);
  }
}


