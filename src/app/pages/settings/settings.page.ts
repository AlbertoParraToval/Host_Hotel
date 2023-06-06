import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { User, UserService } from 'src/app/core';
import { UserFormComponent } from 'src/app/core/components/user-form/user-form.component';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';
import { LocaleService } from 'src/app/core/services/locale.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  language = 1; // 0 español, 1 inglés
  currentLanguage
  esMovil: boolean;
  esPc: boolean;
  
  constructor(private firebase:FirebaseService,
    private translate: TranslateService,
    private locale:LocaleService,
    private userSvc: UserService,
    private modal:ModalController,
    public user:UserService,
    private router:Router,) {
      }

  ngOnInit() {
    this.onResize();
  }
  
  getUser(){
    return this.userSvc.user$;
  }

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }


  private async init(){
    this.translate. setDefaultLang('en');
  }
  ngAfterViewInit(): void {
  
  }
  
  async presentFormUser(userdata:User){
    const modal = await this.modal.create({
      component: UserFormComponent,
      componentProps:{
        user:userdata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
        this.userSvc.updatehotel(result.data.hotel);
    });
  }

  onEditUser(user:User){
    this.presentFormUser(user)
  }

  onLanguage(languageCode: string) {
    this.translate.setDefaultLang(languageCode);
    this.locale.registerCulture(languageCode);
  }
  

  // Esta función se ejecuta cada vez que se redimensiona la pantalla
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.esMovil = window.innerWidth < 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
    this.esPc = window.innerWidth > 768; // Si el ancho de la pantalla es mayor a 768, se considera que se está en una pantalla de escritorio
  }

  

}


