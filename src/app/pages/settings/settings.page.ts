import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/core';
import { FirebaseService } from 'src/app/core/services/firebase/firebase-service';
import { LocaleService } from 'src/app/core/services/locale.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private firebase:FirebaseService,
    private translate: TranslateService,
    private locale:LocaleService,
    public user:UserService,
    private router:Router,) { }

  ngOnInit() {
  }
  

  signOut(){
    this.user.signOut();
    this.router.navigate(['login']);
  }

}
