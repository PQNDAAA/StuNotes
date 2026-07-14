import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupInterface} from "../../auth/signup/interface/signup-interface";
import {LoginInterface} from "../../auth/login/interface/login-interface";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class Api {

  private baseUrl = 'https://api.stunotes.fr';

  constructor(private http: HttpClient) {}

  modifyUser(targetKey: string, newValue: string) {
    return this.http.post(`${this.baseUrl}/users/profile`, {targetKey, newValue});
  }

  checkUsernameExists(username: string) {
    return this.http.get(`${this.baseUrl}/users/check-username/${username}`);
  }

  checkEmailExists(email: string) {
    return this.http.get(`${this.baseUrl}/users/check-email/${email}`);
  }

  createUser(data: SignupInterface) {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  login(data: LoginInterface) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getUserById(){
    return this.http.get(`${this.baseUrl}/users/profile`);
  }

  createSubject(name: string) {
    return this.http.post(`${this.baseUrl}/users/createSubject`, { name });
  }

  //A MODIFIER L URL COMME LE MODIFY USER
  modifyUsername(username: string){
    return this.http.patch(`${this.baseUrl}/users/username/edit`, { username });
  }

  appleSignup(identityToken: string, email: string, name: string){
    return this.http.post(`${this.baseUrl}/auth/apple/signup`, { identityToken, email, name });
}
  googleSignup(idToken: any){
    return this.http.post(`${this.baseUrl}/auth/google/signup`, { idToken });
  }

  updatePhoto(photo: FormData){
    return this.http.patch(`${this.baseUrl}/users/me/photo`, photo);
  }

  getMyPhoto() : Observable<Blob>{
    return this.http.get(`${this.baseUrl}/users/me/photo`, {responseType: "blob"});
  }

  deletePhoto(){
    return this.http.delete(`${this.baseUrl}/users/me/photo`);
  }
}
