import { Component, OnInit,HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { FormHotelComponent, HotelsService, ReviewsService, UserService, hotels, reviews } from 'src/app/core';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
})
export class HotelsPage implements OnInit {
  esMovil: boolean;
  esPc: boolean;
  constructor(
    public user:UserService,
    public hotelsSvc: HotelsService,
    private router:Router,
    private reviewSvc:ReviewsService,
    private modal:ModalController,
    private alert:AlertController,
  ) { }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }

  ngOnInit() {  this.onResize();}
 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }


  getHotels(){
    return this.hotelsSvc.hotel$;
  }

  async presentHotelForm(hoteldata:hotels){
    const modal = await this.modal.create({
      component:FormHotelComponent,
      componentProps:{
        hotel:hoteldata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
      if(result && result.data){
        switch(result.data.mode){
          case 'New':
            this.hotelsSvc.addhotel(result.data.hotel);
            break;
          case 'Edit':
            this.hotelsSvc.updatehotel(result.data.hotel);
            break;
          default:
        }
      }
    });
  }

  onEditHotel(hoteldata){
    this.presentHotelForm(hoteldata);
  }

  onAddHotel(hoteldata){
      this.presentHotelForm(null);
    }

  async onDeleteAlert(hoteldata){
    const alert = await this.alert.create({
      header:'Atención',
      message: '¿Está seguro de que desear borrar a la persona?',
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
            this.hotelsSvc.deletehotel(hoteldata);
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async onHotelExistsAlert(hoteldata){
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

  /* async onDeleteDriver(driverData){
      if((await this.review.getManagesByDriverId(driverData.id)).length==0)
      this.onDeleteAlert(driverData);
    else
      this.onDriverExistsAlert(driverData);
  }
}*/

}