import { Component, HostListener, Input, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Reviews, UserService, HotelsService, ReviewsService, ReviewsFormComponent, User } from 'src/app/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  hotelReviews: Reviews[];
  currentUser: User;


  constructor(
    public user:UserService,
    private router:Router,
    private modal:ModalController,
    private reviewSvc: ReviewsService,
    private alert:AlertController,
    private hotelSvc:HotelsService,
    private userService:UserService,
    private sanitize:DomSanitizer
  ) { }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }

  ngOnInit() { 
    this.onResize();
    this.currentUser = this.userService.currentUser;
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

  downloadJson(){
    console.log(this.hotelReviews)
    this.reviewSvc.saveJsonFile(this.hotelReviews);
  }

  getDownloadLink() {
    const filePath = 'src\\app\\core\\python\\reviews.json';
    return this.sanitize.bypassSecurityTrustUrl(filePath);
  }

  downloadFile(): void {
    const filePath = '../../python/grafic_review.zip'; // Reemplaza con la ruta correcta a tu archivo JSON
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'report.zip'; // Reemplaza con el nombre que deseas que tenga el archivo JSON descargado
    link.target = '_blank'; // Para abrir el enlace en una nueva pestaña (opcional)
    link.click();
  }
}

