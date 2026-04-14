import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class Api {

  private baseUrl = 'http://57.129.40.192:3000';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`);
  }

  createUser(data: {email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/users`, data);
  }

  getUsersByEmail(email: string){
    return this.http.get(`${this.baseUrl}/users/by-email/${email}`);
  }


}
