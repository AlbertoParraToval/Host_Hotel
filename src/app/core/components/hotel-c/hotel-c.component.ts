/**
 * @file hotel-c.component.ts
 * @brief This file contains the HotelCComponent.
 */

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { IonItemSliding } from '@ionic/angular';
import { hotels } from '../../models';
import { Router } from '@angular/router';

/**
 * @class HotelCComponent
 * @brief Represents the HotelCComponent.
 * 
 * This component is responsible for displaying a hotel and handling hotel actions such as edit and delete.
 */
@Component({
  selector: 'app-hotel-c',
  templateUrl: './hotel-c.component.html',
  styleUrls: ['./hotel-c.component.scss'],
})
export class HotelCComponent implements OnInit {

  @Output() onEdit = new EventEmitter(); // Event emitted when the edit button is clicked
  @Output() onDelete = new EventEmitter(); // Event emitted when the delete button is clicked
  @Input() _hotel: hotels; // The hotel data to display

  esMovil: boolean; // Flag indicating whether the device is a mobile
  esPc: boolean; // Flag indicating whether the device is a desktop

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
    this.onResize();
  }

  /**
   * @brief Handles the resize event of the window.
   * @param event The resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // If the screen width is less than 768, it's considered a mobile device
    this.esPc = window.innerWidth > 768; // If the screen width is greater than 768, it's considered a desktop device
  }

  /**
   * @brief Handles the click event of the edit button.
   */
  onEditClick() {
    this.onEdit.emit(this._hotel);
  }

  /**
   * @brief Handles the click event of the delete button.
   */
  onDeleteClick() {
    this.onDelete.emit(this._hotel);
  }
}
