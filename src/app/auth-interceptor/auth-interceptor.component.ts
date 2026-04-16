import { Component, OnInit } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-auth-interceptor',
  templateUrl: './auth-interceptor.component.html',
  styleUrls: ['./auth-interceptor.component.scss'],
})
export class AuthInterceptorComponent implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler){

    const token = localStorage.getItem("token");

    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
    }

}
