import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from './../../models/user.model';
import { LocaleService } from '../../services/locale.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() user: User;
  
  constructor(
    public locale:LocaleService
  ) { }

  ngOnInit() {}

  onEditClick(){
    this.onEdit.emit(this.user);
  }

  onDeleteClick(){
    this.onDelete.emit(this.user);
  }
}
