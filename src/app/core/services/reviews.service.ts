import { Injectable } from '@angular/core';
import { Reviews } from '../models';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from './firebase/firebase-service';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private _reviewsSubject: BehaviorSubject<Reviews[]> = new BehaviorSubject<Reviews[]>([]);
  public reviews$: Observable<Reviews[]> = this._reviewsSubject.asObservable();

  private reviews: Reviews[] = [];


  unsubscr;
  constructor(private firebase: FirebaseService) {
    this.unsubscr = this.firebase.subscribeToCollection(
      'reviews',
      this._reviewsSubject,
      this.mapReview.bind(this) 
    );
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
      fecha: doc.data().fecha.toDate(),
      rating: doc.data().rating,
        text_review: doc.data().  text_review,
    };
  }

  public getReviewsByHotel(hotelId: number): Observable<Reviews[]> {
    return this.reviews$.pipe(
      map((reviews) => reviews.filter((review) => review.id_hoteles === hotelId))
    );
  }
  

  public async deleteReview(reviewId: number): Promise<void> {
    const review = this.reviews.find((review) => review.id === reviewId);
    if (review) {
      try {
        await this.firebase.deleteDocument('reviews', review.docId);
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async updateReview(reviewId: number, updatedReview: Reviews): Promise<void> {
    const review = this.reviews.find((review) => review.id === reviewId);
    if (review) {
      const updatedReviewData = {
        id_user: updatedReview.id_user,
        id_hoteles: updatedReview.id_hoteles,
        fecha: updatedReview.fecha,
        rating: updatedReview.rating,
          text_review: updatedReview.  text_review,
      };
  
      try {
        await this.firebase.updateDocument('reviews', review.docId, updatedReviewData);
        review.id_user = updatedReview.id_user;
        review.id_hoteles = updatedReview.id_hoteles;
        review.fecha = updatedReview.fecha;
        review.rating = updatedReview.rating;
        review.  text_review = updatedReview.  text_review;
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async addReview(review: Reviews): Promise<void> {
    const newReviewData = {
      id_user: review.id_user,
      id_hoteles: review.id_hoteles,
      fecha: review.fecha,
      rating: review.rating,
        text_review: review.  text_review,
    };

    try {
      await this.firebase.createDocument('reviews', newReviewData);
    } catch (error) {
      console.log(error);
    }

    this.reviews.push(review);
    this._reviewsSubject.next(this.reviews);
  }
}