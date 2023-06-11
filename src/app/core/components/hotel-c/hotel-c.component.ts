import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { IonItemSliding } from '@ionic/angular';
import { hotels } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotel-c',
  templateUrl: './hotel-c.component.html',
  styleUrls: ['./hotel-c.component.scss'],
})
export class HotelCComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _hotel:hotels;
  

  esMovil: boolean;
  esPc: boolean;


  constructor(
    public router:Router,
  ){}

  ngOnInit() {  this.onResize();}
 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }

  onEditClick(){

    this.onEdit.emit(this._hotel);
  }

  onDeleteClick(){

    this.onDelete.emit(this._hotel);
  }

}


