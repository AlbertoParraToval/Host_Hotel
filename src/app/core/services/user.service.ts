import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { User, UserLogin, UserRegister } from '../models';
import { FileUploaded, FirebaseService } from './firebase/firebase-service';
import { LocalStorageService } from './local-storage.service';
import { HttpClientProvider } from './http-client.provider';
import { error } from 'console';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _userLogged:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public userLogged$ = this._userLogged.asObservable();

  private _user:BehaviorSubject<User> = new BehaviorSubject(null);
  public user$ = this._user.asObservable();

  private _userSubject:BehaviorSubject<User[]> = new BehaviorSubject([]);
  public _user$ = this._userSubject.asObservable();

  public currentUser: User;

  unsubscr;
  constructor(
    private firebase:FirebaseService,
    private router:Router,
    private toastController: ToastController,
    private translate: TranslateService
  ) {
    this.init();
    this.unsubscr = this.firebase.subscribeToCollection('users',this._userSubject, this.mapUser);
  }

  gOnDestroy(): void {
    this.unsubscr();
  }

  private mapUser(doc:DocumentData){
    return {
      id:0,
      docId:doc['id'],
      admin: doc['data']().admin,
      first_name: doc['data']().first_name,
      last_name: doc['data']().last_name,
      email: doc['data']().email,
      username: doc['data']().username,
      profilePick: doc['data']().profilePick
    };
  }

  private async init(){
    this.firebase.isLogged$.subscribe(async (logged)=>{
      if(logged){
        this._user.next((await this.firebase.getDocument('users', this.firebase.getUser().uid)).data as User);
        this.currentUser = await this.getUserById(this.firebase.getUser().uid);
        this.router.navigate(['home']);
        this.presentToastLoggedUser();
      }
      this._userLogged.next(logged);
    });
    
  }

  public login(credentials:UserLogin):Promise<string>{
    return new Promise<string>(async (resolve, reject)=>{
      if(!this._userLogged.value){
        try {
          await this.firebase.connectUserWithEmailAndPassword(credentials.identifier, credentials.password);
          this.presentToastLoggedUser();
        } catch (error) {
          this.presentToastIncorrectUserOrPassword();
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
  
  public async register(data: UserRegister){
    try {
      if (!this._userLogged.value) {
        const user = await this.firebase.createUserWithEmailAndPassword(data.email, data.password);
        const userData = {
          docId: user.user.uid,
          admin: false,
          username: data.username, 
          profilePick: data.profilePick,
          email: data.email,
          provider: "firebase",
          token: await user.user.getIdToken(),
          first_name: data.first_name,
          last_name: data.last_name,
          
        };
        await this.firebase.createDocumentWithId('users', userData, user.user.uid);
        await this.firebase.connectUserWithEmailAndPassword(data.email, data.password);
      } else {
        throw new Error('Already connected');
      } 
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getUserList(){
    return this._userSubject.value;
  }

  getUserById(id:string):Promise<User>{
    return new Promise<User>(async (resolve, reject)=>{
      try {
        var user = (await this.firebase.getDocument('users', id));
        resolve({
          id:0,
          docId: user.id,
          admin: user.data['admin'],
          first_name:user.data['first_name'],
          username: user.data['username'],
          email: user.data['email'],
          last_name: user.data['last_name'],
          profilePick: user.data['profilePick'] 
        });  
      } catch (error) {
        reject(error);
      }
    });
  }


  async addUser(user:User){
    var _user = {
      docId: user.id,
      admin: user['admin'],
      first_name:user['first_name'],
      last_name: user['surname'],
      email: user['email'],
      username: user['username']
    };
    if(user['pictureFile']){
      var response = await this.uploadImage(user['pictureFile']);
      _user['profilePick'] = response.file;
    }
    try {
      await this.firebase.createDocument('users', _user);  
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

  async updateUser(user:User){
    var _user = {
      docId: user.docId,
      admin: user['admin'],
      first_name:user['first_name'],
      last_name: user['last_name'],
      email: user['email'],
      username: user['username']
    };
    if(user['pictureFile']){
      var response:FileUploaded = await this.uploadImage(user['profilePick']);
      _user['profilePick'] = response.file;
    }
    try {
      await this.firebase.updateDocument('users', user.docId, _user);  
    } catch (error) {
      console.log(error);
    }
      
  }

  async deleteUser(user:User){
    try {
      await this.firebase.deleteUser();
      await this.firebase.deleteDocument('users', user.docId);
    } catch (error) {
      console.log(error);
    }
  }
  

  async writeToFile(){
    var dataToText = JSON.stringify(this._userSubject.value);
    var data = new Blob([dataToText], {type: 'text/plain'});
    this.firebase.fileUpload(data, 'text/plain', 'users', '.txt');
  }


  async presentToastLoggedUser() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.logged')) + this.currentUser?.first_name + '!',
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }

  async presentToastIncorrectUserOrPassword() {
    const toast = await this.toastController.create({
      message: await lastValueFrom(this.translate.get('toasts.incorrectUserOrPassword')),
      duration: 1500,
      position: 'top',
      color: 'danger'
    });

    await toast.present();
  }


  public async recoverPassword(email: string) {
    console.log(email)
    await this.firebase.resetPassword(email);
  }
}