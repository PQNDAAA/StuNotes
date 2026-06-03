import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {UserInterface} from "../interface/user-interface";

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  imports: [
    IonicModule
  ],
  styleUrls: ['./information-card.component.scss']
})
export class InformationCardComponent  implements OnInit {

  @Input() profile!: UserInterface;

  constructor() { }

  ngOnInit() {}

}
