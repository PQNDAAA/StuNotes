import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {UserInterface} from "../interface/user-interface";
import {NgIf} from "@angular/common";
import {Api} from "../../api/services/api";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  imports: [
    IonicModule,
    NgIf,
    FormsModule
  ],
  styleUrls: ['./information-card.component.scss']
})
export class InformationCardComponent  implements OnInit {

  @Input() value!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() index!: number;
  @Input() activeIndex: number = 0;
  @Input() fieldKey!: string;

  newValue!: string;

  @Output() editingChange = new EventEmitter<number>();
  @Output() editingSuccessfully = new EventEmitter<void>();

  constructor(private api: Api) { }

  ngOnInit() {
    this.newValue = this.value;
  }

  startEditing() {
    if(!this.activeIndex){
      this.editingChange.emit(this.index);
    }
  }

  async closeEditing() {
    try{
      if(this.newValue === this.value) return;

      const result = await firstValueFrom(this.api.modifyUser(this.fieldKey, this.newValue));
      if(result){
        console.log(result);
        this.editingSuccessfully.emit();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.editingChange.emit(0);
    }
  }

  get isEditing(): boolean {return this.activeIndex === this.index;}

}
