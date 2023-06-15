import { Component, HostListener, Input, OnInit, Sanitizer } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom, map } from 'rxjs';
import { Reviews, UserService, HotelsService, ReviewsService, ReviewsFormComponent, User } from 'src/app/core';
import { LocaleService } from 'src/app/core/services/locale.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  filteredReviews: Reviews[];
  hotelReviews: Reviews[];
  currentUser: User;
  selectedRating: number;
  


  constructor(
    public user:UserService,
    private router:Router,
    private modal:ModalController,
    private reviewSvc: ReviewsService,
    private alert:AlertController,
    private translate: TranslateService,
    private locale: LocaleService,
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
    this.getReviews().subscribe(hotelReviews => {
      this.hotelReviews = hotelReviews;
      this.filteredReviews = hotelReviews;
    });
    this.currentUser = this.userService.currentUser;
  }


 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }


  getReviews() {
    return this.reviewSvc.reviews$.pipe(
      map((reviews: Reviews[]) => {
        if (this.selectedRating) {
          // Filtrar las reviews por rating
          return reviews.filter((review: Reviews) => review.rating == this.selectedRating);
        } else {
          // Si no se ha seleccionado un rating, mostrar todas las reviews
          return reviews;
        }
      })
    );
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

  async onDeleteAlert(review: Reviews) {
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.deleteUser')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('modal.close')),
          role: 'cancel',
          handler: () => {
            console.log("Operation canceled");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('modal.delete')),
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


  /**
   * @brief Downloads the JSON file.
   */
  downloadJson(){
    console.log(this.hotelReviews)
    this.reviewSvc.saveJsonFile(this.hotelReviews);
  }

  /**
   * @brief Retrieves the download link for a file.
   * @returns The sanitized download link.
   */
  getDownloadLink() {
    const filePath = 'src\\app\\core\\python\\reviews.json';
    return this.sanitize.bypassSecurityTrustUrl(filePath);
  }

  /**
   * @brief Downloads a file.
   */
  downloadFile(): void {
    const filePath = '../../python/grafic_review.zip'; // Reemplaza con la ruta correcta a tu archivo JSON
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'report.zip'; // Reemplaza con el nombre que deseas que tenga el archivo JSON descargado
    link.target = '_blank'; // Para abrir el enlace en una nueva pestaña (opcional)
    link.click();
  }
}

