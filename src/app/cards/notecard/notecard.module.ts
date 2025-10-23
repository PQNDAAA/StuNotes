import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { NotecardComponent} from "./notecard.component";

@NgModule({
  imports: [IonicModule,FormsModule,CommonModule],
  declarations: [NotecardComponent],
  exports: [NotecardComponent]
})

export class NotecardModule {}
