import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
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
    private hotelSvc:HotelsService
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

  onAddReview(review){
    this.presentReviewsForm(null);
  }

  async presentReviewsForm(review:Reviews){
    const modal = await this.modal.create({
      component:ReviewsFormComponent,
      componentProps:{
        review:review
      },
      cssClass:"modal-full-right-side"
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      console.log(result.data)
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.reviewSvc.addReview(result.data.review);
            break;
          case 'Edit':
            this.reviewSvc.updateReview(result.data.review);
            break;
          default:
        }
      }
    });
  }

  onEditReview(review){
    this.presentReviewsForm(review);
  }

  async onDeleteAlert(review){
    const alert = await this.alert.create({
      header: '¿Está seguro de que desear borrar la asignación de tarea?',
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
            this.reviewSvc.deleteReviewbyId(review);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  onDeleteReview(review){
    this.onDeleteAlert(review);
  }

}

