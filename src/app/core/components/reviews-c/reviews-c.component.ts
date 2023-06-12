import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelsService, ReviewsService, UserService } from '../../services';
import { Reviews, User, hotels } from '../../models';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-reviews-c',
  templateUrl: './reviews-c.component.html',
  styleUrls: ['./reviews-c.component.scss'],
})
export class ReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input('review') set review(review:Reviews){
    this._review = review;
    this.loadUserHotel(review);
  }

  public _hotel:BehaviorSubject<hotels> = new BehaviorSubject<hotels>(null);
  public _users:BehaviorSubject<User> = new BehaviorSubject<User>(null);
  hotel$:Observable<hotels> = this._hotel.asObservable();
  user$:Observable<User> = this._users.asObservable();


  private async loadUserHotel(review:Reviews){
    this._hotel.next(await this.hotelSvc.gethotelById(review.id_hoteles));
    console.log(review.id_hoteles)
    this._users.next(await this.userSvc.getUserById(review.id_user));
    console.log(review.id_user)
  }


  getManage():Reviews{
    return this._review;
  }

  public _review:Reviews;


  constructor(
    private userSvc:UserService,
    private hotelSvc:HotelsService,
    public locale:LocaleService
  ){
    
  }

  ngOnInit(
  ) {

  }

  onEditClick(){
    this.onEdit.emit(this._review);
    console.log(this._review)
  }

  onDeleteClick(){
    this.onDelete.emit(this._review);
  }

}
