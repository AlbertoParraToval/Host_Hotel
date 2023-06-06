import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { User, UserLogin, UserRegister } from '../models';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { LocalStorageService } from './local-storage.service';
import { HttpClientProvider } from './http-client.provider';
import { error } from 'console';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _isLogged = new BehaviorSubject<boolean>(false);
  public isLogged$ = this._isLogged.asObservable();
  private _user = new BehaviorSubject<User>(null);
  public user$ = this._user.asObservable();
  constructor(
    private firebase:FirebaseService,
    private router:Router
  ) {
    this.init();
    
  }

  private async init(){
    this.firebase.isLogged$.subscribe(async (logged)=>{
      if(logged){
        this._user.next((await this.firebase.getDocument('users', this.firebase.getUser().uid)).data as User);
        this.router.navigate(['home']);
      }
      this._isLogged.next(logged);
    });
    
  }

  public login(credentials:UserLogin):Promise<string>{
    return new Promise<string>(async (resolve, reject)=>{
      if(!this._isLogged.value){
        try {
          await this.firebase.connectUserWithEmailAndPassword(credentials.identifier, credentials.password);
        } catch (error) {
          reject(error);
          
        }
      }
      else{
        reject('already connected');
      }
    });
    
  }

  signOut(){
    this.firebase.signOut();
    this.router.navigate(['login']);
  }
  

  /**
     * Recovers the password of a user.
     * 
     * @param email - The user's email
     */
  public async recoverPassword(email: string) {
    console.log(email)
    await this.firebase.resetPassword(email);
  }

  register(data:UserRegister){
    return new Promise<string>(async (resolve, reject)=>{
      if(!this._isLogged.value){
        try {
          var _user:UserCredential = (await this.firebase.createUserWithEmailAndPassword(data.email, data.password));
          await this.firebase.createDocumentWithId('users', 
            {
              uid:_user.user.uid,
              username:data.username, 
              nickname:"",
              picture:"",
              email:data.email,
              provider:'firebase',
              token:await _user.user.getIdToken(),
              first_name:data.first_name, 
              last_name:data.last_name
            }, _user.user.uid);
            await this.firebase.connectUserWithEmailAndPassword(data.email, data.password);
        } catch (error) {
          reject(error);
        }
      }
      else{
        reject('already connected');
      }
    });
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

  async updatehotel(user:User){
    var _user = {
      docId:_user.id,
      first_name:_user.first_name,
      last_name:_user.last_name,
      info_hotel:_user.info_hotel,
    };
    if(user['pictureFile']){
      var response:FileUploaded = await this.uploadImage(user['pictureFile']);
      user['p'] = response.file;
    }
    try {
      await this.firebase.updateDocument('hotels', user.uid, _user);  
    } catch (error) {
      console.log(error);
    }
  }




}
