import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

import { LocaleService } from '../../services/locale.service';
import { UserService } from '../../services';
import { Router } from '@angular/router';
import { User } from '../../models';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() user: User;
  esPc:boolean;
  esMovil:boolean;



  constructor(
    public locale:LocaleService,
    public userSvc:UserService,
    public router:Router
  ) { }

  ngOnInit() {  this.onResize();}
 // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }

  signOut(){
    this.userSvc.signOut();
    this.router.navigate(['login']);
  }

  onEditClick(){
    this.onEdit.emit(this.user);
  }

  onDeleteClick(){
    this.onDelete.emit(this.user);
  }
}
