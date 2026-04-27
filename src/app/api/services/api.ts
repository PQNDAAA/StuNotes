import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SignupInterface} from "../../auth/signup/interface/signup-interface";
import {LoginInterface} from "../../auth/login/interface/login-interface";

@Injectable({
  providedIn: 'root',
})
export class Api {

  private baseUrl = 'https://api.stunotes.fr';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  createUser(data: SignupInterface) {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  login(data: LoginInterface) {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  getUserById(){
    return this.http.get(`${this.baseUrl}/users/username`);
  }

  createSubject(name: string){
    return this.http.post(`${this.baseUrl}/users/createSubject`, { name });
  }
}
