import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {UserInterface} from "../interface/user-interface";
import {NgIf} from "@angular/common";
import {Api} from "../../api/services/api";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {Auth} from "../../auth/auth";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  imports: [
    IonicModule,
    NgIf,
    FormsModule,
    TranslatePipe
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

  isValidInput: boolean = true;


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
      if (this.newValue === this.value || !this.isValidInput) return;

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

  checkInput(event: any) {
    const value = event.target.value;

    switch (this.fieldKey) {
      case 'username':
        this.newValue = value.replace(/[^a-zA-Z0-9_-]/g, '');
        event.target.value = this.newValue;

        this.isValidInput = this.authService.isValidUsername(this.newValue);
        break;
      case 'email':
        this.isValidInput = this.authService.isValidEmail(this.newValue);
        break;
      default:
        break;
    }
  }

  get isEditing(): boolean {
    return this.activeIndex === this.index;
  }

  getCurrentLang() {
    return this.translateService.getCurrentLang();
  }
}
