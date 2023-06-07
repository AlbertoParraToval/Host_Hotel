import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HotelsService, ReviewsService, UserService } from '../../services';
import { Reviews, hotels } from '../../models';

@Component({
  selector: 'app-reviews-c',
  templateUrl: './reviews-c.component.html',
  styleUrls: ['./reviews-c.component.scss'],
})
export class ReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _review:Reviews;
  @Input() _hotel:hotels;
  constructor(
    private userSvc:UserService,
    private reviewSvc:ReviewsService,
    private hotelSvc:HotelsService
  ) { }

  ngOnInit() {}

  onEditClick(){
    this.onEdit.emit(this._review);
  }

  onDeleteClick(){
    this.onDelete.emit(this._review);
  }

}
