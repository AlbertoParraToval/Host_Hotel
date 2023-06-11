import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from './firebase/firebase-service';
import { DocumentData } from 'firebase/firestore';
import { Reviews } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private _reviewsSubject: BehaviorSubject<Reviews[]> = new BehaviorSubject<Reviews[]>([]);
  public reviews$ = this._reviewsSubject.asObservable();

  private unsubscr;

  constructor(private firebase: FirebaseService) {
    this.unsubscr = this.firebase.subscribeToCollection('reviews', this._reviewsSubject, this.mapReview);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private mapReview(doc: DocumentData): Reviews {
    return {
      id: 0,
      docId: doc.id,
      id_user: doc.data().id_user,
      id_hoteles: doc.data().id_hoteles,
      fecha: doc.data().fecha,
      rating: doc.data().rating,
      text_review: doc.data().text_review,
    };
  }

  getReviews() {
    return this._reviewsSubject.value;
  }

  async getReviewById(id: string): Promise<Reviews> {
  try {
    const response = await this.firebase.getDocument('reviews', id);
    return {
      id: 0,
      docId: response.id,
      id_user: response.data.id_user,
      id_hoteles: response.data.id_hoteles,
      fecha: response.data.fecha.toDate(),
      rating: response.data.rating,
      text_review: response.data.text_review,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}


  async getReviewsByHotel(hotelId: string): Promise<Reviews[]> {
    try {
      const reviews = await this.firebase.getDocumentsBy('reviews', 'id_hoteles', hotelId);
      return reviews.map((doc: DocumentData) => ({
        id: 0,
        docId: doc.id,
        id_user: doc.data().id_user,
        id_hoteles: doc.data().id_hoteles,
        fecha: doc.data().fecha.toDate(),
        rating: doc.data().rating,
        text_review: doc.data().text_review,
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getReviewsByUser(userId: string): Promise<Reviews[]> {
    try {
      const reviews = await this.firebase.getDocumentsBy('reviews', 'id_user', userId);
      return reviews.map((doc: DocumentData) => ({
        id: 0,
        docId: doc.id,
        id_user: doc.data().id_user,
        id_hoteles: doc.data().id_hoteles,
        fecha: doc.data().fecha.toDate(),
        rating: doc.data().rating,
        text_review: doc.data().text_review,
      }));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteReviewbyId(review:Reviews){
    try {
      if(review)
        await this.firebase.deleteDocument('reviews', review.docId);
    } catch (error) {
      console.log(error);
    }
  }

  async addReview(review:Reviews){
    var _review= {
      docId:review.docId,
      id_user: review.id_user,
      id_hoteles: review.id_hoteles,
      fecha: review.fecha,
      rating: review.rating,
      text_review: review.text_review
    };
    console.log(review.docId)
    try {
      await this.firebase.createDocument('reviews', _review);  
    } catch (error) {
      console.log(error);
    }
  }

  async updateReview(review: Reviews) {
    try {
      await this.firebase.updateDocument('reviews', review.docId, review);
    } catch (error) {
      console.log(error);
    }
  }
}
