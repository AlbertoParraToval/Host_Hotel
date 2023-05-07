import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IonItemSliding } from '@ionic/angular';
import { hotels } from '../../models';

@Component({
  selector: 'app-hotel-c',
  templateUrl: './hotel-c.component.html',
  styleUrls: ['./hotel-c.component.scss'],
})
export class HotelCComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _hotel:hotels;
  
  constructor(
  ){}

  ngOnInit(
  ) {

  }

  onEditClick(slide:IonItemSliding){
    slide.close();
    this.onEdit.emit(this._hotel);
  }

  onDeleteClick(slide:IonItemSliding){
    slide.close();
    this.onDelete.emit(this._hotel);
  }

}


