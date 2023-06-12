import { Injectable } from '@angular/core';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { DocumentData } from 'firebase/firestore';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { hotels } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HotelsService {
  private _hotelSubject:BehaviorSubject<hotels[]> = new BehaviorSubject([]);
  public hotel$ = this._hotelSubject.asObservable();
  
  unsubscr;
  constructor(private firebase: FirebaseService) {
    this.unsubscr = this.firebase.subscribeToCollection('hotels', this._hotelSubject, this.maphotel);
  }
  

  ngOnDestroy(): void {
    this.unsubscr();
  }

  private maphotel(doc:DocumentData){
    return {
      id:0,
      docId:doc.id,
      name_hotel:doc.data().name_hotel,
      localtion_hotel:doc.data().localtion_hotel,
      url_img:doc.data().url_img,
      info_hotel:doc.data().info_hotel,
    };
  }

  filterHotelsByLocation(location: string): Observable<hotels[]> {
    return this.hotel$.pipe(
      map(hotels => hotels.filter(hotel => hotel.localtion_hotel.includes(location)))
    );
  }

  gethotels(){
    return this._hotelSubject.value;
  }

  gethotelById(id: string): Promise<hotels> {
    return new Promise<hotels>(async (resolve, reject) => {
      try {
        var hotel = (await this.firebase.getDocument('hotels', id));
        resolve({
          id: 0,
          docId: hotel.id,
          name_hotel: hotel.data.name_hotel,
          localtion_hotel: hotel.data.location_hotel,
          url_img: hotel.data.url_img,
          info_hotel: hotel.data.info_hotel,
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
      id:0,
      docId:hotel.id,
      name_hotel:hotel.name_hotel,
      localtion_hotel:hotel.localtion_hotel,
      info_hotel:hotel.info_hotel,
    };
    console.log(hotel.docId)
    if(hotel['pictureFile']){
      var response = await this.uploadImage(hotel['pictureFile']);
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
      id:0,
      docId:hotel.id,
      name_hotel:hotel.name_hotel,
      localtion_hotel:hotel.localtion_hotel,
      info_hotel:hotel.info_hotel,
    };
    if(hotel['pictureFile']){
      var response:FileUploaded = await this.uploadImage(hotel['pictureFile']);
      _hotel['url_img'] = response.file;
    }
    try {
      await this.firebase.updateDocument('hotels', hotel.docId, _hotel);  
    } catch (error) {
      console.log(error);
    }
  }

  async writeToFile(){
    var dataToText = JSON.stringify(this._hotelSubject.value);
    var data = new Blob([dataToText], {type: 'text/plain'});
    this.firebase.fileUpload(data, 'text/plain', 'hotels', '.txt');
  }

  /**
   * Saves an object as a JSON file
   * @param obj The object to be saved as JSON
   */
    saveJsonFile(obj: any) {
    // Convert the object to JSON
    const json = JSON.stringify(obj, null, 2);
    
    // Create a Blob object with the JSON content
    const blob = new Blob([json], { type: 'application/json' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'file.json';
    downloadLink.style.display = 'none';
    
    // Add the link to the document
    document.body.appendChild(downloadLink);
    
    // Click the link to download the file
    downloadLink.click();
    
    // Remove the link from the document
    document.body.removeChild(downloadLink);
    
    // Release the Blob URL after a certain time
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
    }
}