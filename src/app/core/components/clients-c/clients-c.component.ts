import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../services';
import { User } from '../../models';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-clients-c',
  templateUrl: './clients-c.component.html',
  styleUrls: ['./clients-c.component.scss'],
})
export class ClientsCComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _user:User;
  esMovil: boolean;
  esPc: boolean;
  accordionExpanded = false;

  constructor(
    public locale:LocaleService
  ) { }

  
  ngOnInit() {  this.onResize();}
 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }

  onEditClick(){
    this.onEdit.emit(this._user);
  }

  onDeleteClick(){

    this.onDelete.emit(this._user);
  }
  toggleAccordion() {
    this.accordionExpanded = !this.accordionExpanded;
  }

}
