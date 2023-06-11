import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelsService, ReviewsService, UserService } from '../../services';
import { Reviews, hotels, User } from '../../models';

import { IonItemSliding } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-user-reviews-c',
  templateUrl: './user-reviews-c.component.html',
  styleUrls: ['./user-reviews-c.component.scss'],
})
export class UserReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input('review') set review(a:Reviews){
    this.review = a;
    this.loadTaskAndPerson(a);
  
  }
  private async loadTaskAndPerson(a:Reviews){
    this._hotels.next(await this.hotelsSvc.gethotelById(a.id_hoteles));
    this._users.next(await this.userSvc.getUserById(a.id_user));
  }

  get reviews():Reviews{
    return this._reviews;
  }

  private _reviews:Reviews;

  private _users:BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _hotels:BehaviorSubject<hotels> = new BehaviorSubject<hotels>(null);
  user$:Observable<User> = this._users.asObservable();
  hotels$:Observable<hotels> = this._hotels.asObservable();
  constructor(
    private userSvc:UserService,
    private hotelsSvc:HotelsService,
    public locale:LocaleService
  ){
    
  }

  ngOnInit(
  ) {

  }

  onEditClick(){

    this.onEdit.emit(this.reviews);
  }

  onDeleteClick(){
    this.onDelete.emit(this.reviews);
  }

  

}

