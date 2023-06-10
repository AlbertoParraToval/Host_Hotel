import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReviewsService, UserService } from '../../services';
import { Reviews } from '../../models';
import { doc } from 'firebase/firestore';
import { FirebaseWebService } from '../../services/firebase/web/firebase-web.service';

@Component({
  selector: 'app-user-reviews-c',
  templateUrl: './user-reviews-c.component.html',
  styleUrls: ['./user-reviews-c.component.scss'],
})
export class UserReviewsCComponent implements OnInit {
  @Output() onEdit = new EventEmitter;
  @Output() onDelete = new EventEmitter;
  @Input() _review:Reviews;
  userReviews: Reviews[];
  

  constructor(private userSvc: UserService,
    private reviewSvc: ReviewsService) { }

    ngOnInit(): void {
      // Obtener el ID de usuario del usuario actual
      const userId = this.userSvc.currentUser?.docId;
    
      if (userId) {
        // Obtener las reseñas del usuario
        this.reviewSvc.getReviewsByUser(userId)
          .subscribe(reviews => {
            this.userReviews = reviews;
          }, error => {
            console.error('Error al obtener las reseñas del usuario:', error);
          });
      }
  }
}

