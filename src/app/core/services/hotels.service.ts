import { Injectable } from '@angular/core';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { hotels } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private _hotelSubject:BehaviorSubject<hotels[]> = new BehaviorSubject([]);
  public hotel$ = this._hotelSubject.asObservable();
  
  unsubscr;
  constructor(
    private firebase:FirebaseService
  ) {
    this.unsubscr = this.firebase.subscribeToCollection('hotels',this._hotelSubject, this.maphotel);
  }

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private maphotel(doc:DocumentData){
    return {
      id:0,
      docId:doc.id,
      first_name:doc.data().first_name,
      last_name:doc.data().last_name,
      nickname:doc.data().nickname,
      picture:doc.data().picture,
    };
  }

  gethotels(){
    return this._hotelSubject.value;

  }

  gethotelById(id:string):Promise<hotels>{
    return new Promise<hotels>(async (resolve, reject)=>{
      try {
        var hotel = (await this.firebase.getDocument('hotels', id));
        resolve({
          id:0,
          docId:hotel.id,
          name_hotel:hotel.data.name_hotel,
          localtion_hotel:hotel.data.last_name,
          url_img:hotel.data.url_img,
          info_hotel:hotel.data.info_hotel,
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  async deletehotel(hotel:hotels){
    try {
      await this.firebase.deleteDocument('hotels', hotel.docId);  
    } catch (error) {
      console.log(error);
    }
  }

  async addhotel(hotel:hotels){
    var _hotel = {
      docId:hotel.id,
      name_hotel:hotel.name_hotel,
      localtion_hotel:hotel.localtion_hotel,
      url_img:hotel.url_img,
      info_hotel:hotel.info_hotel,
    };
    if(hotel['url_img']){
      var response = await this.uploadImage(hotel['url_img']);
      _hotel['url_img'] = response.image;
    }
    try {
      await this.firebase.createDocument('hotels', _hotel);  
    } catch (error) {
      console.log(error);
    }
  }

  uploadImage(file):Promise<any>{  
    return new Promise(async (resolve, reject)=>{
      try {
        const data = await this.firebase.imageUpload(file);  
        resolve(data);
      } catch (error) {
        resolve(error);
      }
    });
  }

  async updatehotel(hotel:hotels){
    var _hotel = {
      docId:hotel.id,
      name_hotel:hotel.name_hotel,
      localtion_hotel:hotel.localtion_hotel,
      url_img:hotel.url_img,
      info_hotel:hotel.info_hotel,
    };
    if(hotel['url_img']){
      var response:FileUploaded = await this.uploadImage(hotel['url_img']);
      _hotel['url_img'] = response.file;
    }
    try {
      await this.firebase.updateDocument('hotels', hotel.docId, _hotel);  
    } catch (error) {
      console.log(error);
    }
  }
}