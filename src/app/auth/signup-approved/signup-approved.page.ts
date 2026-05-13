import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-signup-approved',
  templateUrl: './signup-approved.page.html',
  styleUrls: ['./signup-approved.page.scss'],
  standalone: false
})
export class SignupApprovedPage implements OnInit {

  constructor(private router: Router, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async goToLogin(){
    await this.modalCtrl.dismiss();
    await this.router.navigate(['/login']);
  }

}
