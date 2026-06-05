import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {UserInterface} from "../interface/user-interface";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  imports: [
    IonicModule,
    NgIf
  ],
  styleUrls: ['./information-card.component.scss']
})
export class InformationCardComponent  implements OnInit {

  @Input() value!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() index!: number;
  @Input() activeIndex: number = 0;

  @Output() editingChange = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {}

  startEditing() {
    if(!this.activeIndex){
      this.editingChange.emit(this.index);
    }
  }

  closeEditing() {
    this.editingChange.emit(0);
  }

  get isEditing(): boolean {return this.activeIndex === this.index;}

}
