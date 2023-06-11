/**
 * @file selectable-hotel.component.ts
 * @brief This file contains the SelectableHotelComponent.
 */

import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Reviews, hotels } from '../../models';
import { HotelsService } from '../../services';
import { IonAccordionGroup } from '@ionic/angular';

/**
 * @constant REVIEWS_VALUE_ACCESSOR
 * @brief Provides the value accessor for the SelectableHotelComponent.
 * 
 * It allows the component to be used as a form control and interact with ngModel.
 */
export const REVIEWS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectableHotelComponent),
  multi: true
};

/**
 * @class SelectableHotelComponent
 * @brief Represents the SelectableHotelComponent.
 * 
 * This component is responsible for displaying a selectable hotel and emitting the selected hotel when it changes.
 */
@Component({
  selector: 'app-selectable-hotel',
  templateUrl: './selectable-hotel.component.html',
  styleUrls: ['./selectable-hotel.component.scss'],
  providers: [REVIEWS_VALUE_ACCESSOR]
})
export class SelectableHotelComponent implements OnInit {
  @Input() hotels: hotels; // The list of hotels to display
  @Output() hotelChange: EventEmitter<hotels> = new EventEmitter<hotels>(); // Event emitted when the selected hotel changes

  selectedHotel: hotels = null; // The currently selected hotel
  propagateChange = (_: any) => { } // Function to propagate the selected hotel value
  isDisabled: boolean = false; // Flag to determine if the component is disabled

  constructor(private hoteSvc: HotelsService) { }

  /**
   * @brief Writes a new value to the component.
   * @param obj The new value to set.
   */
  async writeValue(obj: any) {
    try {
      this.selectedHotel = await this.hoteSvc.gethotelById(obj);
      console.log(obj);
    } catch (error) {
      console.log("Failed to retrieve data: " + error);
    }

  }

  /**
   * @brief Registers a callback function to be called when the selected hotel changes.
   * @param fn The callback function.
   */
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * @brief Registers a callback function to be called when the component is touched.
   * @param fn The callback function.
   */
  registerOnTouched(fn: any): void {
  }

  /**
   * @brief Sets the disabled state of the component.
   * @param isDisabled A flag indicating whether the component should be disabled or not.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnInit() { }

  /**
   * @brief Gets the list of hotels.
   * @returns The list of hotels.
   */
  getHotelList() {
    return this.hoteSvc.gethotels();
  }

  /**
   * @brief Handles the click event of a hotel.
   * @param hoteldata The selected hotel.
   * @param accordion The IonAccordionGroup associated with the hotel.
   */
  onHotelClick(hoteldata: hotels, accordion: IonAccordionGroup) {
    this.selectedHotel = hoteldata;
    accordion.value = '';
    this.propagateChange(this.selectedHotel.docId);
    console.log(hoteldata);
  }

}
