/**
 * @file hotels.page.ts
 * @brief This file contains the HotelsPage.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { FormHotelComponent, HotelsService, ReviewsService, UserService, hotels, Reviews } from 'src/app/core';
import { filter } from 'rxjs/operators';

/**
 * @class HotelsPage
 * @brief Represents the HotelsPage.
 * 
 * This page is responsible for displaying hotels and managing hotel-related operations.
 */
@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
})
export class HotelsPage implements OnInit {
  esMovil: boolean;
  filteredHotels: hotels[];
  allHotels: hotels[];
  esPc: boolean;
  provinciaSeleccionada: string;
  provincias: string[] = ['Almería', 'Cádiz', 'Córdoba', 'Granada', 'Huelva', 'Jaén', 'Málaga', 'Sevilla'];
  filtroLocalizacion: string;
  hotelReviews: Reviews[];

  constructor(
    public user: UserService,
    public hotelsSvc: HotelsService,
    private router: Router,
    private modal: ModalController,
    private reviewSvc: ReviewsService,
    private alert: AlertController,
  ) { }

  /**
   * @brief Signs out the user and navigates to the login page.
   */
  signOut() {
    this.user.signOut();
    this.router.navigate(['login']);
  }

  /**
   * @brief Initializes the component.
   */
  ngOnInit() {
    this.getHotels().subscribe(allHotels => {
      this.allHotels = allHotels;
      this.filteredHotels = allHotels;
    });

    this.onResize();
  }

  /**
   * @brief Handles the window resize event.
   * @param event The resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the window width is less than 768, it is considered to be a mobile screen
    this.esPc = window.innerWidth > 768; // If the window width is greater than 768, it is considered to be a desktop screen
  }

  /**
   * @brief Filters hotels based on the selected province.
   */
  onProvinciaSelected() {
    if (this.provinciaSeleccionada) {
      this.filteredHotels = this.allHotels.filter(hotel =>
        hotel.localtion_hotel.includes(this.provinciaSeleccionada)
      );
    } else {
      this.filteredHotels = this.allHotels; // Show all hotels if no province is selected
    }
  }

  /**
   * @brief Retrieves the hotels from the HotelsService.
   * @returns An observable that emits the list of hotels.
   */
  getHotels() {
    return this.hotelsSvc.hotel$;
  }

  /**
   * @brief Presents the hotel form modal for creating or editing a hotel.
   * @param hoteldata The data of the hotel to be edited (optional).
   */
  async presentHotelForm(hoteldata: hotels) {
    const modal = await this.modal.create({
      component: FormHotelComponent,
      componentProps: {
        hotel: hoteldata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result => {
      if (result && result.data) {
        switch (result.data.mode) {
          case 'New':
            this.hotelsSvc.addhotel(result.data.hotel);
            break;
          case 'Edit':
            this.hotelsSvc.updatehotel(result.data.hotel);
            break;
          default:
            // Handle other cases if necessary
        }
      }
    });
  }

  /**
   * @brief Handles the edit hotel action.
   * @param hoteldata The data of the hotel to be edited.
   */
  onEditHotel(hoteldata) {
    this.presentHotelForm(hoteldata);
  }

  /**
   * @brief Handles the add hotel action.
   * @param hoteldata The data of the hotel to be added.
   */
  onAddHotel(hoteldata) {
    this.presentHotelForm(null);
  }

  /**
   * @brief Displays the delete hotel confirmation alert.
   * @param hoteldata The data of the hotel to be deleted.
   */
  async onDeleteAlert(hoteldata) {
    const alert = await this.alert.create({
      header: 'Atención',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Operación cancelada");
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

  /**
   * @brief Displays the hotel exists alert.
   * @param hoteldata The data of the hotel for which the deletion is not possible.
   */
  async onHotelExistsAlert(hoteldata) {
    const alert = await this.alert.create({
      header: 'Error',
      message: 'No es posible borrar el hotel.',
      buttons: [
        {
          text: 'Cerrar',
          role: 'close',
          handler: () => {
            // Handle the close button action if necessary
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  /**
   * @brief Handles the delete hotel action.
   * @param hoteldata The data of the hotel to be deleted.
   */
  async onDeleteHotel(hoteldata) {
    const reviews = await this.reviewSvc.getReviewsByHotel(hoteldata.docId);
    console.log(hoteldata.docId)
    if (reviews.length > 0) {
      this.presentDeleteConfirmationAlert(hoteldata);
    } else {
      this.onDeleteAlert(hoteldata);
    }
  }

  async presentDeleteConfirmationAlert(hoteldata) {
    const alert = await this.alert.create({
      header: 'Atención',
      message: '¿Estás seguro? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log("Operación cancelada");
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
  }
}
