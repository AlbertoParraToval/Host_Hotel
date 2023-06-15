/**
 * @file clients-c.component.ts
 * @brief This file contains the ClientsCComponent class.
 */

import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../services';
import { Reviews, User } from '../../models';
import { LocaleService } from '../../services/locale.service';
import { Router } from '@angular/router';

/**
 * @class ClientsCComponent
 * @brief Represents the ClientsCComponent class.
 * 
 * This component is responsible for displaying the details of a client.
 */
@Component({
  selector: 'app-clients-c',
  templateUrl: './clients-c.component.html',
  styleUrls: ['./clients-c.component.scss'],
})
export class ClientsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter(); /**< Event emitter for the edit event */
  @Output() onDelete = new EventEmitter(); /**< Event emitter for the delete event */
  @Input() _user: User; /**< Input property for the client details */

  esMovil: boolean; /**< Flag indicating whether the device is a mobile */
  esPc: boolean; /**< Flag indicating whether the device is a desktop */
  accordionExpanded = false; /**< Flag indicating whether the accordion is expanded */
  hotelReviews: Reviews[]; /**< Reviews for the client's hotel */

  constructor(
    public locale: LocaleService,
    public router: Router
  ) {}

  ngOnInit() {
    this.onResize();
  }

  /**
   * @brief Handles the resize event of the window.
   * @param event The resize event object.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.esMovil = window.innerWidth < 768; /**< If the screen width is less than 768, it's considered a mobile device */
    this.esPc = window.innerWidth > 768; /**< If the screen width is greater than 768, it's considered a desktop device */
  }

  /**
   * @brief Handles the edit click event.
   */
  onEditClick() {
    this.onEdit.emit(this._user);
  }

  /**
   * @brief Handles the delete click event.
   */
  onDeleteClick() {
    this.onDelete.emit(this._user);
  }

  /**
   * @brief Toggles the accordion state.
   */
  toggleAccordion() {
    this.accordionExpanded = !this.accordionExpanded;
  }
}
