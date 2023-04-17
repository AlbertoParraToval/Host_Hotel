import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserService } from 'src/app/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  esMovil: boolean;
  esPc: boolean;
  constructor(
    public user:UserService,
    private router:Router
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
}
