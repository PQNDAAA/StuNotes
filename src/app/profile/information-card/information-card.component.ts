import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {UserInterface} from "../interface/user-interface";
import {NgIf} from "@angular/common";
import {Api} from "../../api/services/api";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {Auth} from "../../auth/auth";
import {TranslateService} from "@ngx-translate/core";

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
export class InformationCardComponent implements OnInit {

  @Input() value!: string;
  @Input() title!: string;
  @Input() icon!: string;
  @Input() index!: number;
  @Input() activeIndex: number = 0;
  @Input() fieldKey!: string;

  newValue!: string;

  isValidBirthday: boolean = true;

  @Output() editingChange = new EventEmitter<number>();
  @Output() editingSuccessfully = new EventEmitter<void>();

  constructor(private api: Api, private authService: Auth, private translateService: TranslateService) {
  }

  ngOnInit() {
    this.newValue = this.value;
  }

  startEditing() {
    if (!this.activeIndex) {
      this.editingChange.emit(this.index);
    }
  }

  async closeEditing() {
    try {
      if (this.fieldKey === 'dateofbirthday' && !this.isValidBirthday) return;
      if (this.newValue === this.value) return;

      const result = await firstValueFrom(this.api.modifyUser(this.fieldKey, this.newValue));
      if (result) {
        console.log("La BDD a bien été modifié ", result);
        this.editingSuccessfully.emit();
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.editingChange.emit(0);
    }
  }

  loadValue() {
    if (this.fieldKey !== 'dateofbirthday') return;
    return new Date(this.value).toLocaleDateString(this.getCurrentLang(),
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
  }

  get isEditing(): boolean {
    return this.activeIndex === this.index;
  }

  getCurrentLang() {
    return this.translateService.getCurrentLang();
  }
}
