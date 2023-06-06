import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { lastValueFrom } from 'rxjs';
import { UpdateUserFormComponent, User, UserService } from 'src/app/core';
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
    private alert: AlertController,
    public user:UserService,
    private router:Router,) {
      }

  ngOnInit() {
    this.onResize();
  }
  
  getUserActive():User {
    return this.userSvc.currentUser;
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
      component: UpdateUserFormComponent,
      componentProps:{
        user:userdata
      },
    });
    modal.present();
    modal.onDidDismiss().then(result=>{
        this.userSvc.updateUser(result.data.user);
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

  
  async onDeleteUserAlert(user: User){
    const alert = await this.alert.create({
      header: await lastValueFrom(this.translate.get('alerts.warning')),
      message: await lastValueFrom(this.translate.get('alerts.deleteUser')),
      buttons: [
        {
          text: await lastValueFrom(this.translate.get('home.cancel')),
          role: 'cancel',
          handler: () => {
            console.log("Operacion cancelada");
          },
        },
        {
          text: await lastValueFrom(this.translate.get('home.delete')),
          role: 'confirm',
          handler: () => {
            this.userSvc.deleteUser(user);
            this.userSvc.signOut();
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  onDeleteUser(user: User){
    this.onDeleteUserAlert(user);
  } 
}


