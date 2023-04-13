import { Component } from '@angular/core';
import { User, UserService } from 'src/app/core';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor(
    public user:UserService
  ) { }

  ngOnInit() {}

}
